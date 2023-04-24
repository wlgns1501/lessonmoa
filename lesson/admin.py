from django.contrib import admin
from lesson.models import Lesson


class LessonAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "limit_user", "user_count", "start_date", "end_date", "created_at", "sub_category"]


admin.site.register(Lesson, LessonAdmin)
