from django.contrib import admin
from .models import RFQChatMessage

# Register your models here.

@admin.register(RFQChatMessage)
class RFQChatMessageAdmin(admin.ModelAdmin):
    list_display = ('rfq', 'created_at')
    search_fields = ('sender',)
    list_filter = ('sender',)
# Register your models here.
