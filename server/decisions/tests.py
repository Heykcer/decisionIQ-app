from unittest.mock import patch, MagicMock
from bson import ObjectId
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class HealthCheckTests(APITestCase):
    def test_health_check(self):
        url = reverse("health_check")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("status"), "ok")


class AuthTests(APITestCase):
    def setUp(self):
        self.register_url = reverse("register")
        self.token_url = reverse("token_obtain_pair")
        self.user = User.objects.create_user(
            username="existinguser",
            email="existing@example.com",
            password="securepassword123",
        )

    def test_register_success(self):
        payload = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "mypassword123",
        }
        response = self.client.post(self.register_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="newuser").exists())

    def test_register_duplicate_username(self):
        payload = {
            "username": "existinguser",
            "email": "other@example.com",
            "password": "mypassword123",
        }
        response = self.client.post(self.register_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_jwt_token(self):
        payload = {
            "username": "existinguser",
            "password": "securepassword123",
        }
        response = self.client.post(self.token_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)


class UserProfileTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="profileuser",
            email="profile@example.com",
            password="securepassword123",
        )
        self.client.force_authenticate(user=self.user)
        self.me_url = reverse("me")
        self.update_me_url = reverse("me_update")

    def test_get_profile(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "profileuser")
        self.assertEqual(response.data["email"], "profile@example.com")

    def test_update_profile(self):
        payload = {"username": "updatedname", "email": "updated@example.com"}
        response = self.client.patch(self.update_me_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "updatedname")
        self.assertEqual(response.data["email"], "updated@example.com")

        self.user.refresh_from_db()
        self.assertEqual(self.user.username, "updatedname")


class DecisionsApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="decisionuser",
            password="securepassword123",
        )
        self.client.force_authenticate(user=self.user)
        self.list_create_url = reverse("decisions_list")

    @patch("decisions.views.decisions_collection")
    def test_create_decision(self, mock_collection):
        mock_result = MagicMock()
        mock_result.inserted_id = ObjectId("507f1f77bcf86cd799439011")
        mock_collection.insert_one.return_value = mock_result

        payload = {
            "situation": "Job offer at startup vs corporate",
            "decision": "Accept startup offer",
            "reasoning": "High growth potential",
        }
        response = self.client.post(self.list_create_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["id"], "507f1f77bcf86cd799439011")
        self.assertEqual(response.data["situation"], payload["situation"])

    @patch("decisions.views.decisions_collection")
    def test_create_decision_validation_error(self, mock_collection):
        payload = {"situation": "Only situation provided"}
        response = self.client.post(self.list_create_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("decisions.views.decisions_collection")
    def test_list_decisions(self, mock_collection):
        fake_docs = [
            {
                "_id": ObjectId("507f1f77bcf86cd799439011"),
                "user_id": self.user.id,
                "situation": "Test Situation",
                "decision": "Test Decision",
            }
        ]
        mock_cursor = MagicMock()
        mock_cursor.sort.return_value = fake_docs
        mock_collection.find.return_value = mock_cursor

        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], "507f1f77bcf86cd799439011")

    def test_detail_invalid_id_returns_404(self):
        url = reverse("decision_detail", kwargs={"pk": "invalid-hex-id"})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
