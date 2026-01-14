from django.contrib import admin
from .models import ProjectManager
# Register your models here.
@admin.register(ProjectManager)
class ProjectManagerAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone')
    search_fields = ('name',)
    list_filter = ('name',)