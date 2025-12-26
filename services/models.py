from django.db import models
import uuid
from clients.models import Client
# Create your models here.
class Service(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name

class Service_Info(models.Model):
    category=models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='service_info',
    )
    name=models.CharField(max_length=255)
    # information=models.TextField(blank=True)

    def __str__(self):
        return self.name

class CustomServiceRequest(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    service_name = models.CharField(max_length=255)
    description = models.TextField()
    selected_services = models.ManyToManyField(Service_Info)
    status = models.CharField(max_length=50, default="Pending")  # Pending/Approved/Rejected
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.service_name

class CustomServiceImage(models.Model):
    custom_service = models.ForeignKey(CustomServiceRequest, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to="services/images/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.custom_service.service_name}"