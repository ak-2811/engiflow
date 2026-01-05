from django.urls import path,include
from .views import CustomServiceRequestCreateView
from .views import ServiceListView, RFQStatsView,AdminRFQListView,AdminRFQDetailView,AdminActiveRFQsView,ClientActiveRFQsView
from rest_framework.routers import DefaultRouter

# Create the router and register the ServiceViewSet
# router = DefaultRouter()
# router.register(r'services', ServiceViewSet)


urlpatterns = [
    path('services/', ServiceListView.as_view(), name='service-list'),  # Fetch services with sub-services
    # path('services/',include(router.urls)),
    path('custom-request/', CustomServiceRequestCreateView.as_view(), name='custom-service-request'),  # Create custom service
    path('rfq-stats/', RFQStatsView.as_view(), name='rfq_stats'),
    path('admin/rfqs/', AdminRFQListView.as_view()),
    path('admin/rfqs/<int:pk>/', AdminRFQDetailView.as_view()),
    path("admin/rfqs/active/", AdminActiveRFQsView.as_view()),
    path("client/rfqs/active/", ClientActiveRFQsView.as_view()),

]
