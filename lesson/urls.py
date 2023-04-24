from django.urls import path
from lesson.api.views import *

urlpatterns = [path("", LessonView.as_view(), name="lessons")]

