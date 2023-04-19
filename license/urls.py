from django.urls import path, include, re_path
from license.api.views import LicenseView

urlpatterns = [path("", LicenseView.as_view(), name="instructors")]
