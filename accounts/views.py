from rest_framework import generics, permissions
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class LoginView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=400)

        if not user.check_password(password):
            return Response({"error": "Invalid credentials"}, status=400)
        
        role = "unknown"

        if user.is_staff or user.is_superuser:
            role = "admin"
        elif hasattr(user, "client"):
            role = "client"
        elif hasattr(user, "project_manager"):
            role = "project_manager"

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": role,
            "first_name": user.first_name,
        })
