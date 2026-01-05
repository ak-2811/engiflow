from rest_framework import serializers
from .models import Service, Service_Info, CustomServiceRequest, CustomServiceImage

class ServiceInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service_Info
        fields = ['id', 'name']

class ServiceSerializer(serializers.ModelSerializer):
    service_info = ServiceInfoSerializer(many=True)  # Nested serializer for sub-services
    
    class Meta:
        model = Service
        fields = ['id', 'name']  # Return service categories with sub-services
        

class CustomServiceRequestSerializer(serializers.ModelSerializer):
    selected_services = serializers.PrimaryKeyRelatedField(queryset=Service_Info.objects.all(), many=True)
    
    class Meta:
        model = CustomServiceRequest
        fields = ['id', 'client', 'service_name', 'description', 'selected_services', 'status', 'created_at','end_date']
        read_only_fields = ['client', 'status', 'created_at']
    
    def create(self, validated_data):
        # Handle creating the custom service request (without images)
        return super().create(validated_data)


class CustomServiceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomServiceImage
        fields = ['id', 'custom_service', 'image']
