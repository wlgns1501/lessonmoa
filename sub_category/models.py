from django.db import models
from category.models import Category


class SubCategory(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(default="", max_length=100, null=False, blank=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="sub_categories")
    created_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "sub_category"
