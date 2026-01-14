from django.urls import path,include
from .views import RFQParticipantsView,RFQAdminClientChatView,RFQAdminClientSendMessageView

urlpatterns = [
path("rfq/<int:rfq_id>/participants/", RFQParticipantsView.as_view()),
path("rfq/<int:rfq_id>/admin-client/", RFQAdminClientChatView.as_view()),
path("rfq/<int:rfq_id>/admin-client/send/", RFQAdminClientSendMessageView.as_view()),
]