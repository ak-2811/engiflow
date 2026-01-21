from django.urls import path
from .views import SubVendorListView

urlpatterns=[
    path("subvendors/", SubVendorListView.as_view()),
]