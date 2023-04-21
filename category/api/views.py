import json
from django.shortcuts import render
from rest_framework.views import APIView
from account.authentication import JWTAuthentication
from category.api.serializers import (
    CategorySerializer,
    CategoryDetailSerializer,
)
from category.models import Category
from rest_framework import status
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema


class CategoriesView(APIView):
    serializer_classes = CategorySerializer

    @swagger_auto_schema(tags=["카테고리 리스트"])
    def get(self, request):
        try:
            categories = Category.objects.all()
        except Category.DoesNotExist:
            return Response({"categories": []}, status.HTTP_200_OK)

        serializer = self.serializer_classes(categories, many=True)

        return Response({"categories": serializer.data}, status.HTTP_200_OK)


class CategoryView(APIView):
    serializer_classes = CategoryDetailSerializer

    @swagger_auto_schema(tags=["카테고리"])
    def get(self, request, category_id: int):
        try:
            category = Category.objects.prefetch_related("sub_categories").get(id=category_id)
        except Category.DoesNotExist:
            return Response({"error": "해당 카테고리가 존재하지 않습니다."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_classes(category)

        return Response({"category": serializer.data}, status=status.HTTP_200_OK)
