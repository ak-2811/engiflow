import uuid
from django.db import models


class Company(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    name = models.CharField(max_length=255)
    logo = models.TextField(blank=True)  # store logo URL or path

    def __str__(self):
        return self.name
