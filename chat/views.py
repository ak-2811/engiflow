from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.parsers import MultiPartParser
from .models import RFQChatMessage
from subvendors.models import SubVendor
from deliverables.models import Deliverable
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
            # sender_role__in=["admin", "client"],
            chat_type=RFQChatMessage.ChatType.ADMIN_CLIENT
        )

        return Response(RFQChatMessageSerializer(messages, many=True).data)
    
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
            chat_type=RFQChatMessage.ChatType.ADMIN_CLIENT,
            attachment=request.FILES.get("attachment")
        )

        return Response({"success": True})
    
# Sending the message
# class RFQAdminClientSendMessageView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, rfq_id):
#         rfq = CustomServiceRequest.objects.get(id=rfq_id)

#         if request.user.is_staff:
#             role = "admin"
#         elif hasattr(request.user, "client") and rfq.client.user == request.user:
#             role = "client"
#         else:
#             return Response(status=403)

#         RFQChatMessage.objects.create(
#             rfq=rfq,
#             sender=request.user,
#             sender_role=role,
#             message=request.data.get("message", ""),
#             attachment=request.FILES.get("attachment")
#         )

#         return Response({"success": True})

# Fetching Chat Message
class RFQAdminPMChatView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, rfq_id):
        rfq = CustomServiceRequest.objects.get(id=rfq_id)
        pm = getattr(request.user, "project_manager", None)

        if not request.user.is_staff and not (
            pm and rfq.assigned_to_id == pm.id
        ):
            return Response(status=403)
        # if not request.user.is_staff and not (
        #     hasattr(request.user, "project_manager") and
        #     rfq.assigned_to.user == request.user
        # ):
        #     return Response(status=403)

        messages = RFQChatMessage.objects.filter(
            rfq=rfq,
            # sender_role__in=["admin", "project_manager"],
            chat_type=RFQChatMessage.ChatType.ADMIN_PM

        )

        return Response(RFQChatMessageSerializer(messages, many=True).data)
    
    def post(self, request, rfq_id):
        rfq = CustomServiceRequest.objects.get(id=rfq_id)

        if request.user.is_staff:
            role = "admin"
        elif rfq.assigned_to.user == request.user:
            role = "project_manager"
        else:
            return Response(status=403)

        RFQChatMessage.objects.create(
            rfq=rfq,
            sender=request.user,
            sender_role=role,
            message=request.data.get("message", ""),
            chat_type=RFQChatMessage.ChatType.ADMIN_PM,
            attachment=request.FILES.get("attachment")
        )

        return Response({"success": True})
    
class PMSubVendorChatView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, rfq_id):
        subvendor_id = request.query_params.get("subvendor_id")
        deliverable_id = request.query_params.get("deliverable_id")
        if not subvendor_id:
            return Response({"detail": "subvendor_id required"}, status=400)

        try:
            subvendor = SubVendor.objects.get(id=subvendor_id)
            deliverable = Deliverable.objects.get(
                id=deliverable_id,
                rfq_id=rfq_id
            )
        except (SubVendor.DoesNotExist, Deliverable.DoesNotExist):
            return Response(status=404)

        # ✅ security check: subvendor must be assigned to THIS deliverable
        if not deliverable.assigned_subvendors.filter(id=subvendor.id).exists():
            return Response(status=403)

        qs = RFQChatMessage.objects.filter(
            rfq_id=rfq_id,
            deliverable=deliverable,
            chat_type=RFQChatMessage.ChatType.PM_SUBVENDOR,
            receiver_subvendor=subvendor
        )

        return Response(RFQChatMessageSerializer(qs, many=True).data)

    def post(self, request, rfq_id):
        subvendor_id = request.query_params.get("subvendor_id")
        deliverable_id = request.query_params.get("deliverable_id")
        if not subvendor_id:
            return Response({"detail": "subvendor_id required"}, status=400)

        try:
            subvendor = SubVendor.objects.get(id=subvendor_id)
            deliverable = Deliverable.objects.get(
                id=deliverable_id,
                rfq_id=rfq_id
            )
        except (SubVendor.DoesNotExist, Deliverable.DoesNotExist):
            return Response(status=404)

        # ✅ security check again
        if not deliverable.assigned_subvendors.filter(id=subvendor.id).exists():
            return Response(status=403)

        RFQChatMessage.objects.create(
            rfq_id=rfq_id,
            deliverable=deliverable,
            sender=request.user,
            sender_role="project_manager",
            receiver_subvendor=subvendor,
            chat_type=RFQChatMessage.ChatType.PM_SUBVENDOR,
            message=request.data.get("message", ""),
            attachment=request.FILES.get("attachment")
        )

        return Response({"success": True})
