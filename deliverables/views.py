from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Deliverable,DeliverableAttachment
from .serializers import DeliverableSerializer, DeliverableAttachmentSerializer
from subvendors.models import SubVendor

# Create your views here.
class RFQDeliverableListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, rfq_id):
        qs = Deliverable.objects.filter(rfq_id=rfq_id)
        return Response(DeliverableSerializer(qs, many=True).data)

    def post(self, request, rfq_id):
        serializer = DeliverableSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        deliverable= serializer.save(
            rfq_id=rfq_id,
            created_by=request.user
        )
        files = request.FILES.getlist("attachment")
        for f in files:
            DeliverableAttachment.objects.create(
            deliverable=deliverable,
            file=f
        )
        return Response(DeliverableSerializer(deliverable).data, status=201)
    
class DeliverableDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        d = Deliverable.objects.get(pk=pk)
        serializer = DeliverableSerializer(d, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        Deliverable.objects.filter(pk=pk).delete()
        return Response(status=204)

class Subvendorstats(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            subvendor = SubVendor.objects.get(user=request.user)
        except SubVendor.DoesNotExist:
            return Response(
                {"detail": "SubVendor profile not found"},
                status=403
            )

        deliverables = Deliverable.objects.filter(
            assigned_subvendors=subvendor,
            status="Assigned"
        ).order_by("-created_at")


    
class SubVendorAssignedDeliverablesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # map logged-in user → SubVendor
        try:
            subvendor = SubVendor.objects.get(user=request.user)
        except SubVendor.DoesNotExist:
            return Response(
                {"detail": "SubVendor profile not found"},
                status=403
            )

        deliverables = Deliverable.objects.filter(
            assigned_subvendors=subvendor,
            status="Assigned"
        ).order_by("-created_at")

        serializer = DeliverableSerializer(deliverables, many=True)
        return Response(serializer.data)