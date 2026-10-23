# decisions/views.py
from datetime import datetime, timezone
import logging
from bson import ObjectId
from bson.errors import InvalidId
from django.contrib.auth.models import User
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from pymongo.errors import PyMongoError

from .serializers import UserRegistrationSerializer, UserSerializer
from backend.mongo import decisions_collection

logger = logging.getLogger(__name__)


@api_view(["GET"])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint to verify API is responsive."""
    return Response({"status": "ok", "service": "DecisionIQ API"})


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "message": "User registered successfully",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                    },
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    """Return the profile information of the currently authenticated user."""
    user = request.user
    return Response(
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        }
    )


@api_view(["PATCH", "PUT"])
@permission_classes([IsAuthenticated])
def update_me(request):
    """Update username and/or email for the currently authenticated user."""
    user = request.user
    data = request.data
    username = data.get("username", "").strip() if data.get("username") is not None else None
    email = data.get("email", "").strip() if data.get("email") is not None else None

    errors = {}

    if username:
        if User.objects.filter(username__iexact=username).exclude(id=user.id).exists():
            errors["username"] = ["This username is already taken."]
        else:
            user.username = username

    if email is not None:
        if email != "":
            try:
                validate_email(email)
                user.email = email
            except ValidationError:
                errors["email"] = ["Please provide a valid email address."]
        else:
            user.email = ""

    if errors:
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    user.save()
    return Response(
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        }
    )


class DecisionListCreate(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        try:
            # Sort newest first by MongoDB _id (which is chronologically ordered)
            cursor = decisions_collection.find({"user_id": user_id}).sort("_id", -1)
            docs = []
            for d in cursor:
                d["id"] = str(d.pop("_id"))
                docs.append(d)
            return Response(docs)
        except PyMongoError as exc:
            logger.error("MongoDB error fetching decisions: %s", exc)
            return Response(
                {"detail": "Unable to connect to database. Please check MongoDB configuration."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

    def post(self, request):
        user_id = request.user.id
        if not isinstance(request.data, dict):
            return Response({"detail": "Invalid request payload."}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()

        # Basic validation
        situation = data.get("situation", "")
        decision = data.get("decision", "")
        if not situation or not decision:
            return Response(
                {"detail": "Both situation and decision are required fields."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Sanitize internal keys
        data.pop("_id", None)
        data.pop("id", None)
        data["user_id"] = user_id
        data.setdefault("outcome", None)
        data.setdefault("created_at", datetime.now(timezone.utc).isoformat())

        try:
            result = decisions_collection.insert_one(data)
            data["id"] = str(result.inserted_id)
            data.pop("_id", None)
            return Response(data, status=status.HTTP_201_CREATED)
        except PyMongoError as exc:
            logger.error("MongoDB error saving decision: %s", exc)
            return Response(
                {"detail": "Unable to connect to database. Please check MongoDB configuration."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )


class DecisionDetail(APIView):
    permission_classes = [IsAuthenticated]

    def _parse_id(self, pk):
        try:
            return ObjectId(pk)
        except (InvalidId, TypeError):
            return None

    def _get_doc(self, user_id, pk):
        oid = self._parse_id(pk)
        if oid is None:
            return None
        doc = decisions_collection.find_one({"_id": oid, "user_id": user_id})
        if not doc:
            return None
        doc["id"] = str(doc.pop("_id"))
        return doc

    def get(self, request, pk):
        try:
            doc = self._get_doc(request.user.id, pk)
            if not doc:
                return Response({"detail": "Decision not found."}, status=status.HTTP_404_NOT_FOUND)
            return Response(doc)
        except PyMongoError as exc:
            logger.error("MongoDB error fetching decision %s: %s", pk, exc)
            return Response(
                {"detail": "Unable to connect to database."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

    def patch(self, request, pk):
        user_id = request.user.id
        oid = self._parse_id(pk)
        if oid is None:
            return Response({"detail": "Decision not found."}, status=status.HTTP_404_NOT_FOUND)

        if not isinstance(request.data, dict):
            return Response({"detail": "Invalid request payload."}, status=status.HTTP_400_BAD_REQUEST)

        # Avoid updating protected/immutable fields
        update_data = {
            k: v for k, v in request.data.items()
            if k not in ("_id", "id", "user_id")
        }
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

        try:
            result = decisions_collection.update_one(
                {"_id": oid, "user_id": user_id},
                {"$set": update_data},
            )
            if result.matched_count == 0:
                return Response({"detail": "Decision not found."}, status=status.HTTP_404_NOT_FOUND)

            doc = self._get_doc(user_id, pk)
            return Response(doc)
        except PyMongoError as exc:
            logger.error("MongoDB error updating decision %s: %s", pk, exc)
            return Response(
                {"detail": "Unable to connect to database."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

    def delete(self, request, pk):
        user_id = request.user.id
        oid = self._parse_id(pk)
        if oid is None:
            return Response({"detail": "Decision not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            result = decisions_collection.delete_one({"_id": oid, "user_id": user_id})
            if result.deleted_count == 0:
                return Response({"detail": "Decision not found."}, status=status.HTTP_404_NOT_FOUND)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except PyMongoError as exc:
            logger.error("MongoDB error deleting decision %s: %s", pk, exc)
            return Response(
                {"detail": "Unable to connect to database."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
