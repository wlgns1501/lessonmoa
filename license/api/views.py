import json
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from license.api.serializer import LicenseSerailizer
from license.models import License
from rest_framework import status
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from account.authentication import JWTAuthentication
from license.api.serializer import LicenseSerailizer


class LicenseView(APIView):
    serializer_class = LicenseSerailizer
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        user = JWTAuthentication.authenticate(self, request)
        user_id = user[1].id

        body = json.loads(request.body)
        body["user_id"] = user_id

        serializer = self.serializer_class(data=body)

        if serializer.is_valid(raise_exception=True):
            serializer.save()

            return Response(
                {"license": serializer.data}, status=status.HTTP_201_CREATED
            )

        else:
            return Response(
                {"license": serializer.error}, status=status.HTTP_400_BAD_REQUEST
            )
