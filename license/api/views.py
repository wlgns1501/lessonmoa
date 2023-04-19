from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from license.api.serializer import LicenseSerailizer
from license.models import License
from rest_framework import status
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema


class LicenseView(ListAPIView):
    serializer_class = LicenseSerailizer
    queryset = License.objects.all()

    @swagger_auto_schema(tags=["강사증 리스트"])
    def get(self, request):
        return None
        # try:
        #     instructors = Instructor.objects.all()
        # except Instructor.DoesNotExist:
        #     return Response({"instructors": []}, status=status.HTTP_200_OK)

        # serializer = self.serializer_class(instructors, many=True)

        # return Response({"instructors": serializer.data}, status=status.HTTP_200_OK)
