from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.parsers import MultiPartParser
from .models import RFQChatMessage
from services.models import CustomServiceRequest
from .serializers import RFQChatMessageSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
# Create your views here.
# Fetching the name for dropdown
class RFQParticipantsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, rfq_id):
        if not request.user.is_staff:
            return Response(status=403)

        rfq = CustomServiceRequest.objects.get(id=rfq_id)

        return Response({
            "client": {
                "id": rfq.client.user.id,
                "name": rfq.client.user.get_full_name()
            },
            "project_manager": {
                "id": rfq.assigned_to.user.id if rfq.assigned_to else None,
                "name": rfq.assigned_to.user.get_full_name() if rfq.assigned_to else None
            }
        })
# Fetching the chat Message

class RFQAdminClientChatView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, rfq_id):
        rfq = CustomServiceRequest.objects.get(id=rfq_id)

        # access control
        if request.user.is_staff:
            pass
        elif hasattr(request.user, "client") and rfq.client.user == request.user:
            pass
        else:
            return Response(status=403)

        messages = RFQChatMessage.objects.filter(
            rfq=rfq,
            sender_role__in=["admin", "client"]
        )

        return Response(RFQChatMessageSerializer(messages, many=True).data)
    
# Sending the message
class RFQAdminClientSendMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, rfq_id):
        rfq = CustomServiceRequest.objects.get(id=rfq_id)

        if request.user.is_staff:
            role = "admin"
        elif hasattr(request.user, "client") and rfq.client.user == request.user:
            role = "client"
        else:
            return Response(status=403)

        RFQChatMessage.objects.create(
            rfq=rfq,
            sender=request.user,
            sender_role=role,
            message=request.data.get("message", ""),
            attachment=request.FILES.get("attachment")
        )

        return Response({"success": True})


