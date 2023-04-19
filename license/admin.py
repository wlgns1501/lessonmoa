from django.contrib import admin
from license.models import License


class LicenseAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "image_url"]


admin.site.register(License, LicenseAdmin)
