from django.db import models
from django.conf import settings
import uuid
from django.contrib.auth.models import User
from services.models import CustomServiceRequest
from subvendors.models import SubVendor

# Create your models here.
class Deliverable(models.Model):
    rfq = models.ForeignKey(CustomServiceRequest, on_delete=models.CASCADE, related_name="deliverables")
    title = models.CharField(max_length=255)
    description = models.TextField()
    # attachment = models.FileField(upload_to="deliverables/", null=True, blank=True)
    assigned_subvendors = models.ManyToManyField(SubVendor, related_name="deliverables")
    # created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_deliverables"
    )
    status = models.CharField(max_length=50, default="Assigned")
    created_at = models.DateTimeField(auto_now_add=True)

# deliverables/models.py
class DeliverableAttachment(models.Model):
    deliverable = models.ForeignKey(
        Deliverable,
        related_name="attachment",
        on_delete=models.CASCADE
    )
    file = models.FileField(upload_to="deliverables/")
    uploaded_at = models.DateTimeField(auto_now_add=True)


