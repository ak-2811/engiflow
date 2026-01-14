from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .models import ProjectManager
# Create your views here.
class ProjectManagerListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        pms = ProjectManager.objects.select_related("user")

        data = [
            {
                "id": pm.id,
                "name": pm.name,
                "email": pm.email,
            }
            for pm in pms
        ]

        return Response(data)


