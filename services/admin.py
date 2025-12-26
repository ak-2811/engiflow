from django.contrib import admin
from .models import Service,Service_Info,CustomServiceRequest,CustomServiceImage

# Register your models here.
@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    list_filter = ('name',)

@admin.register(Service_Info)
class Service_InfoAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
    search_fields = ('name',)
    list_filter = ('name', 'category')

@admin.register(CustomServiceRequest)
class CustomServiceRequestAdmin(admin.ModelAdmin):
    list_display = ('service_name', 'client', 'status')
    search_fields = ('service_name', 'client')
    list_filter = ('service_name',)

@admin.register(CustomServiceImage)
class CustomServiceImageAdmin(admin.ModelAdmin):
    list_display = ('custom_service', 'uploaded_at',)
    search_fields = ('custom_service',)
    list_filter = ('custom_service',)
