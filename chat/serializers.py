from rest_framework import serializers
from .models import RFQChatMessage

class RFQChatMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.get_full_name", read_only=True)

    class Meta:
        model = RFQChatMessage
        fields = [
            "id",
            "sender_role",
            "sender_name",
            "message",
            "attachment",
            "created_at",
        ]
