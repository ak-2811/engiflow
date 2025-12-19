import uuid
from django.db import models


# -------------------------
# Project
# -------------------------
class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    company = models.ForeignKey(
        'accounts.Company',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='project'
    )

    client = models.ForeignKey(
        'clients.Client',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='project'
    )

    name = models.CharField(max_length=255)
    stage = models.CharField(max_length=50)
    status = models.IntegerField(default=0)
    services = models.TextField(blank=True)

    start_date = models.DateField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# -------------------------
# RFQ
# -------------------------
class RFQ(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='rfqs'
    )

    request_details = models.TextField()
    required_date = models.DateField(null=True, blank=True)
    attachments = models.JSONField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"RFQ - {self.project.name}"


# -------------------------
# Quote
# -------------------------
class Quote(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='quotes'
    )

    rfq = models.ForeignKey(
        RFQ,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='quotes'
    )

    revision_no = models.IntegerField(default=0)
    scope_text = models.TextField()
    assumptions = models.TextField(blank=True)
    exclusions = models.TextField(blank=True)

    value = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.IntegerField(default=0)
    follow_up_date = models.DateField(null=True, blank=True)
    pdf_path = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Quote {self.revision_no} - {self.project.name}"
