from rest_framework import serializers
from category.models import Category
from django.db import IntegrityError
from sub_category.api.serializers import *


class CategorySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    created_at = serializers.DateTimeField(read_only=True)

    def post(self, validated_data):
        name = validated_data["name"]

        if name is None:
            return serializers.ValidationError("이름을 작성해주세요")

        try:
            category = Category.objects.create(name=name)
        except IntegrityError as e:
            if "category_name_key" in e.args[0]:
                raise serializers.ValidationError("중복된 이름 입니다.")

        return category

    class Meta:
        model = Category
        fields = ["id", "name", "created_at"]


class CategoryDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    sub_category = SubCategorySerializer(read_only=True, many=True)
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "sub_category", "created_at"]
