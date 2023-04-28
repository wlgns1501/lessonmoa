from rest_framework import serializers
from account.api.serializers import UserSerializer
from lesson.models import Lesson, User_Lesson


class LessonSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField()
    limit_user = serializers.IntegerField()
    user_count = serializers.IntegerField(read_only=True)
    # user_id = serializers.IntegerField(write_only=True)
    # user = UserSerializer(read_only=True)
    start_date = serializers.DateTimeField()
    end_date = serializers.DateTimeField()
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Lesson
        fields = [
            "id",
            "name",
            "limit_user",
            "user_count",
            # "user",
            # "user_id",
            "start_date",
            "end_date",
            "created_at",
        ]


class UserLessonSerializer(serializers.ModelSerializer):
    id = serializers.CharField()
    user_id = serializers.IntegerField(write_only=True)
    lesson_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = User_Lesson
        fields = ["id", "user_id", "lesson_id"]
