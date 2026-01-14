# project_managers/urls.py
from django.urls import path
from .views import ProjectManagerListView

urlpatterns = [
    path("list/", ProjectManagerListView.as_view()),
]
