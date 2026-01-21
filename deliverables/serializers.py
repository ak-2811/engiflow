from rest_framework import serializers
from .models import Deliverable, DeliverableAttachment
from subvendors.models import SubVendor
from subvendors.serializers import SubVendorMiniSerializer

class DeliverableAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliverableAttachment
        fields = ["id", "file"]

class DeliverableSerializer(serializers.ModelSerializer):
    assigned_subvendors = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=SubVendor.objects.all()
    )

    assigned_subvendors_details = SubVendorMiniSerializer(
        source="assigned_subvendors",
        many=True,
        read_only=True
    )

    attachment = DeliverableAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Deliverable
        fields = [
            "id",
            "rfq",
            "title",
            "description",
            "attachment",
            "assigned_subvendors",
            "assigned_subvendors_details",
            "status",
            "created_by",
            "created_at",
        ]
        read_only_fields = ["rfq", "created_by", "created_at"]