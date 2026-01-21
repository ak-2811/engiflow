from django.db import models
from django.conf import settings
import uuid
from django.contrib.auth.models import User
from services.models import CustomServiceRequest
from subvendors.models import SubVendor
from deliverables.models import Deliverable
# Create your models here.

class RFQChatMessage(models.Model):

    class ChatType(models.TextChoices):
        ADMIN_CLIENT = "admin_client", "Admin ↔ Client"
        ADMIN_PM = "admin_pm", "Admin ↔ Project Manager"
        PM_SUBVENDOR = "pm_subvendor", "PM ↔ SubVendor"

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
            ("project_manager","Project Manager"),
            ("subvendor","SubVendor")
        ]
    )

    deliverable = models.ForeignKey(
    Deliverable,
    null=True,
    blank=True,
    on_delete=models.CASCADE
)


    receiver_subvendor = models.ForeignKey(
        SubVendor,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="received_messages"
    )
    chat_type = models.CharField(          
        max_length=20,
        choices=ChatType.choices,
        default='ADMIN_CLIENT'
    )

    message = models.TextField(blank=True)
    attachment = models.FileField(upload_to="rfq_chat/", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

