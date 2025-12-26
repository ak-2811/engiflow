from rest_framework import serializers
from django.contrib.auth.models import User
from clients.models import Client
from accounts.models import Company


class ClientRegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    company_phone = serializers.CharField(required=False, allow_blank=True)
    country = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        # 1️⃣ Create auth user
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )

        # # 2️⃣ Auto-assign EngiFlow company
        # company = Company.objects.get(name="EngiFlow")

        # 3️⃣ Create client record
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

        return user
