from django.db import models
from account.models import User
from sub_category.models import SubCategory


class Lesson(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, null=False, blank=False)
    limit_user = models.IntegerField(null=False, blank=False, default=12)
    user_count = models.IntegerField(default=limit_user)

    sub_category = models.ForeignKey(SubCategory, on_delete=models.CASCADE, related_name="lessons")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="lesson")

    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    # class Status(models.TextChoices):
    #     recruitment = "Recruitment",

    # status = models.CharField(choices=Status.choices)

    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "lesson"


class User_Lesson(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_lesson")
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="user_lesson")

    class Meta:
        db_table = "user_lesson"

