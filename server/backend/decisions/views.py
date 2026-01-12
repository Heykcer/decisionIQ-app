# decisions/views.py
from bson import ObjectId
from django.contrib.auth.models import User
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .serializers import UserRegistrationSerializer
from backend.mongo import decisions_collection


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    return Response(
        {
            "username": user.username,
            "email": user.email,
        }
    )


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_me(request):
    user = request.user
    username = request.data.get("username")
    email = request.data.get("email")

    if username:
        user.username = username
    if email:
        user.email = email
    user.save()

    return Response(
        {
            "username": user.username,
            "email": user.email,
        }
    )


class DecisionListCreate(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        docs = list(decisions_collection.find({"user_id": user_id}))
        for d in docs:
            d["id"] = str(d.pop("_id"))
        return Response(docs)

    def post(self, request):
        user_id = request.user.id
        data = request.data.copy()
        data["user_id"] = user_id
        data.setdefault("outcome", None)

        result = decisions_collection.insert_one(data)
        data["id"] = str(result.inserted_id)
        data.pop("_id", None)
        return Response(data, status=status.HTTP_201_CREATED)


class DecisionDetail(APIView):
    permission_classes = [IsAuthenticated]

    def _get_doc(self, user_id, pk):
        doc = decisions_collection.find_one(
            {"_id": ObjectId(pk), "user_id": user_id}
        )
        if not doc:
            return None
        doc["id"] = str(doc.pop("_id"))
        return doc

    def patch(self, request, pk):
        user_id = request.user.id
        update = {"$set": request.data}
        decisions_collection.update_one(
            {"_id": ObjectId(pk), "user_id": user_id},
            update,
        )
        doc = self._get_doc(user_id, pk)
        if not doc:
          return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(doc)

    def delete(self, request, pk):
        user_id = request.user.id
        decisions_collection.delete_one(
            {"_id": ObjectId(pk), "user_id": user_id}
        )
        return Response(status=status.HTTP_204_NO_CONTENT)
