from django.db import models
from django.conf import settings
import uuid
from django.contrib.auth.models import User
from services.models import CustomServiceRequest
# Create your models here.

class RFQChatMessage(models.Model):
    rfq = models.ForeignKey(
        CustomServiceRequest,
        on_delete=models.CASCADE,
        related_name="chat_messages"
    )

    sender = models.ForeignKey(User, on_delete=models.CASCADE)

    sender_role = models.CharField(
        max_length=20,
        choices=[
            ("admin", "Admin"),
            ("client", "Client"),
        ]
    )

    message = models.TextField(blank=True)
    attachment = models.FileField(upload_to="rfq_chat/", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

