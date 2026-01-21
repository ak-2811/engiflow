from django.contrib import admin
from .models import SubVendor
# Register your models here.
@admin.register(SubVendor)
class SubVendorAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone')
    search_fields = ('name',)
    list_filter = ('name',)