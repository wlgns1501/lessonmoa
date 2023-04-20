from django.urls import path
from django.contrib import admin
from category.api.views import *

urlpatterns = [
    path("", CategoriesView.as_view(), name="categories"),
    path("<int:category_id>/", CategoryView.as_view(), name="category"),
]
