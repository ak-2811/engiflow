from django.urls import path,include
from .views import RFQParticipantsView,RFQAdminClientChatView
from .views import RFQAdminPMChatView, PMSubVendorChatView

urlpatterns = [
path("rfq/<int:rfq_id>/participants/", RFQParticipantsView.as_view()),
path("rfq/<int:rfq_id>/admin-client/", RFQAdminClientChatView.as_view()),
path("rfq/<int:rfq_id>/admin-pm/", RFQAdminPMChatView.as_view()),
path("rfq/<int:rfq_id>/pm-subvendor/",PMSubVendorChatView.as_view()),
]