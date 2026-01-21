from django.contrib import admin
from .models import Deliverable, DeliverableAttachment
# Register your models here.
@admin.register(Deliverable)
class DeliverableAdmin(admin.ModelAdmin):
    list_display = ('rfq', 'title', 'created_by')
    search_fields = ('title', 'created_by')
    list_filter = ('title', 'created_by')

@admin.register(DeliverableAttachment)
class DeliverableAttachmentAdmin(admin.ModelAdmin):
    list_display = ('deliverable','uploaded_at')