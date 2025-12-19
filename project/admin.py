from django.contrib import admin
from .models import Project, RFQ, Quote


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'client', 'status', 'stage')
    search_fields = ('name',)
    list_filter = ('company', 'status')


@admin.register(RFQ)
class RFQAdmin(admin.ModelAdmin):
    list_display = ('project', 'required_date')
    list_filter = ('project',)


@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    list_display = ('project', 'revision_no', 'value', 'status')
    list_filter = ('status',)
