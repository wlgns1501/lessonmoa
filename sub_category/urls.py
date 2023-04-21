from django.urls import path
from sub_category.api.views import *

urlpatterns = [
    path("<int:category_id>/sub_category/", SubCategoryView.as_view(), name="sub_categories",),
    path("<int:category_id>/sub_category/<int:sub_category_id>", SubCategoryDetailView.as_view(), name="sub_category",),
]
