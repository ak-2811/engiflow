from rest_framework import serializers
from .models import SubVendor

class SubVendorMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubVendor
        fields = ["id", "name", "email", "company_phone"]