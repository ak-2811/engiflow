from rest_framework import generics
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.parsers import MultiPartParser
from .models import CustomServiceRequest, CustomServiceImage, Service
from .serializers import CustomServiceRequestSerializer, CustomServiceImageSerializer, ServiceSerializer
from rest_framework.response import Response
from rest_framework import viewsets
# from rest_framework.response import Response
from .models import Service, Client
from .serializers import ServiceSerializer
from rest_framework.views import APIView


# View for fetching predefined services (parent + child)
class ServiceListView(generics.ListAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]
    def list(self, request, *args, **kwargs):
        # Customize the response to include service_info for each service
        services = self.get_queryset()
        response_data = []

        for service in services:
            response_data.append({
                "id": service.id,
                "name": service.name,
                "service_info": [{
                    "id": sub_service.id,
                    "name": sub_service.name,
                    # "description": sub_service.description,
                } for sub_service in service.service_info.all()]  # Assuming you have a related name `service_info` for the sub-services
            })
        
        return Response(response_data)


# View for creating custom service request (handles multiple images)
class CustomServiceRequestCreateView(generics.CreateAPIView):
    queryset = CustomServiceRequest.objects.all()
    serializer_class = CustomServiceRequestSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated clients can create services
    parser_classes = [MultiPartParser]  # To handle image uploads

    def perform_create(self, serializer):
        # Create the custom service request instance
        service_request = serializer.save(client=self.request.user.client)

        # Now handle saving the images
        images = self.request.FILES.getlist('images')  # Get all uploaded images
        for image in images:
            # Create a new CustomServiceImage instance for each uploaded image
            CustomServiceImage.objects.create(custom_service=service_request, image=image)

        return service_request
    
#View for getting the count of the active and pending rfq
class RFQStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        client = request.user.client  # safe due to OneToOne

        pending_count = CustomServiceRequest.objects.filter(
            client=client,
            status='Pending'
        ).count()

        active_count = CustomServiceRequest.objects.filter(
            client=client,
            status='Active'
        ).count()

        return Response({
            "pending_rfqs": pending_count,
            "active_rfqs": active_count
        })
class AdminRFQListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        rfqs = CustomServiceRequest.objects.select_related(
            'client__user'
        ).order_by('-created_at')[:3]

        data = [
            {
                "id": f"RFQ-{r.id}",
                "client": r.client.user.username,
                "description": r.description,
                "date": r.created_at.strftime("%Y-%m-%d %H:%M"),
                "end_date":r.end_date,
                "raw_id": r.id,
            }
            for r in rfqs
        ]

        return Response(data)
    
class AdminRFQDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        rfq = CustomServiceRequest.objects.select_related(
            'client__user'
        ).get(id=pk)

        images = CustomServiceImage.objects.filter(custom_service=rfq)

        return Response({
            "id": f"RFQ-{rfq.id}",
            "status": rfq.status,
            "title": rfq.service_name,   # or services_selected
            "client": rfq.client.user.username,
            "date": rfq.created_at.strftime("%B %d, %Y"),
            "overview": rfq.description,
            "attachments": [
                {
                    "name": img.image.name.split('/')[-1],
                    "url": img.image.url
                } for img in images
            ]
        })

class AdminActiveRFQsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        rfqs = (
            CustomServiceRequest.objects
            .filter(status="Active")
            .order_by("-created_at")
        )

        data = [
            {
                "id": f"RFQ-{r.id}",
                "raw_id": r.id,
                "client": r.client.user.username if r.client else "-",
                "description": r.description,
                "date": r.created_at.strftime("%Y-%m-%d"),
                "end_date": r.end_date.strftime("%Y-%m-%d") if r.end_date else "-"
            }
            for r in rfqs
        ]

        return Response(data)
    
class ClientActiveRFQsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        rfqs = CustomServiceRequest.objects.filter(
            client__user=user,
            status="Active"
        ).order_by("-created_at")
        data = [
            {
                "id": f"RFQ-{r.id}",
                "raw_id": r.id,
                "client": r.client.user.username if r.client else "-",
                "description": r.description,
                "date": r.created_at.strftime("%Y-%m-%d"),
                "end_date": r.end_date.strftime("%Y-%m-%d") if r.end_date else "-"
            }
            for r in rfqs
        ]

        # serializer = RFQSerializer(rfqs, many=True)
        return Response(data)

