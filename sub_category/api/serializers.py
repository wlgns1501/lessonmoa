from rest_framework import serializers
from sub_category.models import SubCategory


class SubCategorySerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField()
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = SubCategory
        fields = ["id", "name", "created_at"]
