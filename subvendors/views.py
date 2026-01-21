from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import SubVendor
from .serializers import SubVendorMiniSerializer

# Create your views here.
class SubVendorListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = SubVendor.objects.all().order_by("name")
        return Response(SubVendorMiniSerializer(qs, many=True).data)