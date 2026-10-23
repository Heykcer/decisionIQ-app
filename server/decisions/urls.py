# decisions/urls.py
from django.urls import path
from .views import (
    health_check,
    RegisterView,
    me,
    update_me,
    DecisionListCreate,
    DecisionDetail,
)

urlpatterns = [
    path("health/", health_check, name="health_check"),
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("me/", me, name="me"),
    path("me/update/", update_me, name="me_update"),
    path("decisions/", DecisionListCreate.as_view(), name="decisions_list"),
    path("decisions/<str:pk>/", DecisionDetail.as_view(), name="decision_detail"),
]
