from django.urls import path
from .views import ClientRegisterView, LoginView

urlpatterns = [
    path("auth/client/register/", ClientRegisterView.as_view()),
    path("auth/login/", LoginView.as_view()),
]
