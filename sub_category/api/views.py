from django.shortcuts import render
from rest_framework.views import APIView
from sub_category.api.serializers import *
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema


class SubCategoryView(APIView):
    serializer_class = SubCategorySerializer

    @swagger_auto_schema(tags=["서브 카테고리 목록"])
    def get(self, request, category_id: int):
        try:
            sub_categories = list(SubCategory.objects.filter(category_id=category_id))
        except SubCategory.DoesNotExist:
            return Response({"sub_categories": []}, status=status.HTTP_200_OK)

        serializer = self.serializer_class(sub_categories, many=True)

        return Response({"sub_categories": serializer.data}, status=status.HTTP_200_OK)