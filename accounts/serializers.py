from rest_framework import serializers
from django.contrib.auth.models import User
from clients.models import Client
from accounts.models import Company
from project_managers.models import ProjectManager


class RegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    username = serializers.CharField()
    user_type=serializers.ChoiceField(choices=["client", "project_manager"],write_only=True)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    company_phone = serializers.CharField(required=False, allow_blank=True)
    country = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        user_type = validated_data.pop("user_type")
        # 1️⃣ Create auth user
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )
        
        full_name = f'{user.first_name} {user.last_name}'

        # 3️⃣ Create client record
        if user_type == "client":
            Client.objects.create(
                # company=company,
                user=user,
                name=f'{validated_data["first_name"]} {validated_data["last_name"]}',
                email=validated_data["email"],
                phone=validated_data.get("phone", ""),
                company_phone=validated_data.get("company_phone", ""),
                country=validated_data.get("country", ""),
                title="",
                birthdate=None,
                notes="",
            )
        elif user_type=="project_manager":
            ProjectManager.objects.create(
                user=user,
                name=f'{validated_data["first_name"]} {validated_data["last_name"]}',
                email=validated_data["email"],
                phone=validated_data.get("phone", ""),
                company_phone=validated_data.get("company_phone", ""),
                country=validated_data.get("country", ""),
                title="",
                birthdate=None,
                notes="",
            )


        return user
