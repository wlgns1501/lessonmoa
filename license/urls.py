from django.urls import path, include, re_path
from license.api.views import *

urlpatterns = [path("", LicenseView.as_view(), name="licenses"), path('<int:license_id>', LicenseDetailView.as_view(), name='license')]
