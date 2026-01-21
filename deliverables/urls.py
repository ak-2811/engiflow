from django.urls import path
from .views import RFQDeliverableListCreateView, DeliverableDetailView, SubVendorAssignedDeliverablesView

# deliverables/urls.py
urlpatterns=[
path("rfq/<int:rfq_id>/deliverables/", RFQDeliverableListCreateView.as_view()),
path("deliverables/<int:pk>/", DeliverableDetailView.as_view()),
path("subvendor/deliverables/assigned/", SubVendorAssignedDeliverablesView.as_view()),
]