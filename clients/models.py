from django.db import models
from django.conf import settings
import uuid
# Create your models here.
class Client(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    company = models.ForeignKey(
        'accounts.Company',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='client'
    )
    name = models.CharField(max_length=255)
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    company_phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField()
    title = models.CharField(max_length=100, blank=True)
    birthdate = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
