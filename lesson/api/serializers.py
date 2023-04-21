from rest_framework import serializers

from lesson.models import Lesson


class LessonSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    limit_user = serializers.IntegerField()
    user_count = serializers.IntegerField()
    # sub_category_id = serializers.IntegerField()
    user_id = serializers.IntegerField()
    start_date = serializers.DateTimeField()
    end_date = serializers.DateTimeField()
    created_at = serializers.DateTimeField()

    class Meta:
        model = Lesson
        fields = [
            "id",
            "name",
            "limit_user",
            "user_count",
            "user_id",
            "start_date",
            "end_date",
            "created_at",
        ]

