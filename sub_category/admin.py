from django.contrib import admin
from sub_category.models import SubCategory
from django import forms


class SubCategoryForm(forms.ModelForm):
    class Meta:
        model = SubCategory
        exclude = ["created_at"]


class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "category", "created_at"]

    def save_model(self, request, obj, form, change):
        obj.save()

    def delete_model(self, request, obj):
        obj.delete()


admin.site.register(SubCategory, SubCategoryAdmin)
