from django.db import models
from account.models import User
from category.models import Category


class License(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, null=False, blank=False)
    image_url = models.URLField(null=False, blank=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="license")
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="license"
    )

    class Status(models.TextChoices):
        PENDING = "Pending"
        ACTIVE = "Active"
        DELETED = "Deleted"

    status = models.CharField(choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "license"
