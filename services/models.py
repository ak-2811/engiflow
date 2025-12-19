from django.db import models
import uuid
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
        blank=True
    )
    name=models.CharField(max_length=255)
    information=models.TextField(blank=True)

    def __str__(self):
        return self.name