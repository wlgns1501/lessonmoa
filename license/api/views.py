import json
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from account.models import User
from license.api.serializer import LicenseSerailizer, LicenseDetailSerializer
from license.models import License
from rest_framework import status
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from account.authentication import JWTAuthentication
from license.api.serializer import LicenseSerailizer
from django.db import transaction
from django.utils.decorators import method_decorator
from drf_yasg import openapi


class LicenseView(APIView):
    serializer_class = LicenseSerailizer
    authentication_classes = [JWTAuthentication]
    # queryset = License.objects.all()

    @method_decorator(
        decorator=swagger_auto_schema(
            tags=["자격증 등록하기"],
            request_body=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "name": openapi.Schema(
                        type=openapi.TYPE_STRING, description="name"
                    ),
                    "image_url": openapi.Schema(
                        type=openapi.TYPE_STRING, description="image_url"
                    ),
                    "category_id": openapi.Schema(
                        type=openapi.TYPE_INTEGER, description="category_id"
                    ),
                },
            ),
        )
    )
    def post(self, request):
        user = JWTAuthentication.authenticate(self, request)
        user_id = user[0].id

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


class LicenseDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    serializer_class = LicenseDetailSerializer
    # queryset = License.objects.get()

    @swagger_auto_schema(tags=["라이센스 상세보기"])
    def get(self, request, license_id: int):
        user = JWTAuthentication.authenticate(self, request)
        user_id = user[0].id

        try:
            license = License.objects.get(id=license_id, user_id=user_id)
        except License.DoesNotExist:
            return Response(
                {"error": "해당 라이센스가 존재하지 않습니다."}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.serializer_class(license)

        return Response({"license": serializer.data}, status=status.HTTP_200_OK)

    @method_decorator(
        decorator=swagger_auto_schema(
            tags=["자격증 수정하기"],
            request_body=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "name": openapi.Schema(
                        type=openapi.TYPE_STRING, description="name"
                    ),
                    "image_url": openapi.Schema(
                        type=openapi.TYPE_STRING, description="image_url"
                    ),
                    "category_id": openapi.Schema(
                        type=openapi.TYPE_INTEGER, description="category_id"
                    ),
                },
            ),
        )
    )
    def patch(self, request, license_id: int):
        user = JWTAuthentication.authenticate(self, request)
        user_id = user[0].id

        try:
            license = License.objects.get(id=license_id, user_id=user_id)
        except License.DoesNotExist:
            return Response(
                {"error": "해당 라이센스가 존재하지 않습니다."}, status=status.HTTP_404_NOT_FOUND
            )

        body = json.loads(request.body)

        serializer = self.serializer_class(license, data=body)

        if serializer.is_valid(raise_exception=True):
            serializer.save()

            return Response({"license": serializer.data}, status=status.HTTP_200_OK)

        return Response(
            {"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
        )

    @transaction.atomic
    @swagger_auto_schema(tags=["라이센스 삭제하기"])
    def delete(self, request, license_id: int):
        user = JWTAuthentication.authenticate(self, request)
        user_id = user[0].id

        try:
            license = License.objects.get(id=license_id, user_id=user_id)
        except License.DoesNotExist:
            return Response(
                {"error": "해당 라이센스가 존재하지 않습니다."}, status=status.HTTP_404_NOT_FOUND
            )

        try:
            license.delete()
        except:
            return Response(
                {"error": "해당 라이센스를 지우는데 실패하였습니다."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            users_licenses = list(
                License.objects.filter(user_id=user_id, status="Active")
            )
            if len(users_licenses) == 0:
                user = User.objects.get(id=user_id)
                user.is_instructor = False
                user.save()

        except:
            return Response(
                {"error": "해당 라이센스를 지우는데 실패하였습니다."}, status=status.HTTP_400_BAD_REQUEST
            )

        return Response({"success": True}, status=status.HTTP_200_OK)
