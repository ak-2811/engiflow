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
from project_managers.models import ProjectManager


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

        # ✅ ADMIN
        if request.user.is_staff:
            return Response({
                "total_active_rfqs": CustomServiceRequest.objects.filter(
                    admin_status="Active"
                ).count(),
                "total_pending_rfqs": CustomServiceRequest.objects.filter(
                    admin_status="Pending"
                ).count(),
            })

        # ✅ CLIENT
        if hasattr(request.user, "client"):
            client = request.user.client

            return Response({
                "active_rfqs": CustomServiceRequest.objects.filter(
                    client=client,
                    status="Active"
                ).count(),
                "pending_rfqs": CustomServiceRequest.objects.filter(
                    client=client,
                    status="Pending"
                ).count(),
            })
        
        # ✅ PROJECT MANAGER
        if hasattr(request.user, "project_manager"):
            pm = request.user.project_manager

            return Response({
                "pm_active_rfqs": CustomServiceRequest.objects.filter(
                    assigned_to=pm,
                    pm_status="Active"
                ).count(),
                "pm_pending_rfqs": CustomServiceRequest.objects.filter(
                    assigned_to=pm,
                    pm_status="Pending"
                ).count(),
            })

        # ✅ SAFETY (Project Manager / others)
        return Response(
            {"detail": "Role not supported"},
            status=403
        )

    
class AdminRFQListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        rfqs = CustomServiceRequest.objects.select_related(
            'client__user'
        ).order_by('-created_at')[:3]

        data = [
            {
                "id": f"RFQ-{r.id}",
                "client": r.client.user.first_name,
                "description": r.description,
                "rfq_name":r.service_name,
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
            "raw_id":rfq.id,
            "status": rfq.status,
            'admin_status':rfq.admin_status,
            "pm_status":rfq.pm_status,
            "title": rfq.service_name,   # or services_selected
            "client": rfq.client.user.first_name,
            "date": rfq.created_at.strftime("%B %d, %Y"),
            "end_date": rfq.end_date.strftime("%Y-%m-%d") if rfq.end_date else "-",
            "assigned_to": {
                "id": rfq.assigned_to.id,
                "name": rfq.assigned_to.name,
            } if rfq.assigned_to else None,
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
            .filter(admin_status="Active")
            .order_by("-created_at")
        )

        data = [
            {
                "id": f"RFQ-{r.id}",
                "raw_id": r.id,
                "client": r.client.user.first_name if r.client else "-",
                "description": r.description,
                "rfq_name":r.service_name,
                "date": r.created_at.strftime("%Y-%m-%d"),
                "end_date": r.end_date.strftime("%Y-%m-%d") if r.end_date else "-"
            }
            for r in rfqs
        ]

        return Response(data)

class AdminPendingRFQsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        rfqs = (
            CustomServiceRequest.objects
            .filter(admin_status="Pending")
            .order_by("-created_at")
        )

        data = [
            {
                "id": f"RFQ-{r.id}",
                "raw_id": r.id,
                "client": r.client.user.first_name if r.client else "-",
                "description": r.description,
                "rfq_name":r.service_name,
                "date": r.created_at.strftime("%Y-%m-%d"),
                "end_date": r.end_date.strftime("%Y-%m-%d") if r.end_date else "-"
            }
            for r in rfqs
        ]

        return Response(data)

class AdminAllRFQsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        rfqs = (
            CustomServiceRequest.objects
            .order_by("-created_at")
        )

        data = [
            {
                "id": f"RFQ-{r.id}",
                "raw_id": r.id,
                "client": r.client.user.first_name if r.client else "-",
                "description": r.description,
                "rfq_name":r.service_name,
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
                "client": r.client.user.first_name if r.client else "-",
                "description": r.description,
                "rfq_name":r.service_name,
                "date": r.created_at.strftime("%Y-%m-%d"),
                "end_date": r.end_date.strftime("%Y-%m-%d") if r.end_date else "-"
            }
            for r in rfqs
        ]

        # serializer = RFQSerializer(rfqs, many=True)
        return Response(data)
    
# services/views.py
class AssignProjectManagerView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, pk):
        pm_id = request.data.get("project_manager_id")

        if not pm_id:
            return Response({"error": "PM required"}, status=400)

        rfq = CustomServiceRequest.objects.get(id=pk)
        pm = ProjectManager.objects.get(id=pm_id)

        rfq.assigned_to = pm
        rfq.admin_status = "Active"
        rfq.save()

        return Response({
            "assigned_to": {
                "id": rfq.assigned_to.id,
                "name": rfq.assigned_to.name
            } if rfq.assigned_to else None,
            "admin_status": rfq.admin_status
        })
    
class PMAllRFQsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not hasattr(request.user, "project_manager"):
            return Response({"detail": "Not a Project Manager"}, status=403)

        pm = request.user.project_manager

        rfqs = (
            CustomServiceRequest.objects
            .filter(assigned_to=pm)
            .order_by("-created_at")
        )

        data = [
            {
                "id": f"RFQ-{r.id}",
                "raw_id": r.id,
                "client": r.client.user.first_name if r.client else "-",
                "rfq_name": r.service_name,
                "description": r.description,
                "rfq_name":r.service_name,
                "pm_status": r.pm_status,
                "date": r.created_at.strftime("%Y-%m-%d"),
                "end_date": r.end_date.strftime("%Y-%m-%d") if r.end_date else "-"
            }
            for r in rfqs
        ]

        return Response(data)
    
class PMActiveRFQsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not hasattr(request.user, "project_manager"):
            return Response({"detail": "Not a Project Manager"}, status=403)

        pm = request.user.project_manager

        rfqs = (
            CustomServiceRequest.objects
            .filter(assigned_to=pm)
            .filter(pm_status='Active')
            .order_by("-created_at")
        )

        data = [
            {
                "id": f"RFQ-{r.id}",
                "raw_id": r.id,
                "client": r.client.user.first_name if r.client else "-",
                "rfq_name": r.service_name,
                "description": r.description,
                "rfq_name":r.service_name,
                "pm_status": r.pm_status,
                "date": r.created_at.strftime("%Y-%m-%d"),
                "end_date": r.end_date.strftime("%Y-%m-%d") if r.end_date else "-"
            }
            for r in rfqs
        ]

        return Response(data)
class PMPendingRFQsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not hasattr(request.user, "project_manager"):
            return Response({"detail": "Not a Project Manager"}, status=403)

        pm = request.user.project_manager

        rfqs = (
            CustomServiceRequest.objects
            .filter(assigned_to=pm)
            .filter(pm_status='Pending')
            .order_by("-created_at")
        )

        data = [
            {
                "id": f"RFQ-{r.id}",
                "raw_id": r.id,
                "client": r.client.user.first_name if r.client else "-",
                "rfq_name": r.service_name,
                "description": r.description,
                "rfq_name":r.service_name,
                "pm_status": r.pm_status,
                "date": r.created_at.strftime("%Y-%m-%d"),
                "end_date": r.end_date.strftime("%Y-%m-%d") if r.end_date else "-"
            }
            for r in rfqs
        ]

        return Response(data)



