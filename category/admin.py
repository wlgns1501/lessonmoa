import json
from django.contrib import admin
from category.models import Category
from django import forms


class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        exclude = ["createdAt"]


class CategoryAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "created_at"]
    fields = ["name"]
    form = CategoryForm
    actions = ["patch_category"]

    def save_model(self, request, obj, form, change):
        obj.save()

    def delete_model(self, request, obj):
        obj.delete()


admin.site.register(Category, CategoryAdmin)
