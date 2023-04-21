from rest_framework import serializers
from lesson.api.serializers import LessonSerializer
from sub_category.models import SubCategory


class SubCategorySerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField()
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = SubCategory
        fields = ["id", "name", "created_at"]


class SubCategoryDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField()
    lessons = LessonSerializer(read_only=True, many=True)
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = SubCategory
        fields = ["id", "name", "created_at", "lessons"]

