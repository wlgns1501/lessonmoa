from django.contrib import admin
from license.models import License

# from rangefilter.filter import DateRangeFilter


class LicenseAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "name",
        "image_url",
        "user",
        "status",
        "category",
        "created_at",
    ]
    list_filter = ("status", "created_at")
    actions = ["check_license", "block_license"]

    def check_license(self, request, queryset):

        for license in queryset:
            update_license = queryset.update(status="Active")
            # user = license.user
            # user.is_instructor = True
            # user.save()

        self.message_user(request, "{}건의 License Active 상태로 변경".format(update_license))

    def block_license(self, request, queryset):
        for license in queryset:
            if license.status == "Active":
                update_license = queryset.update(status="Deleted")

            # user = license.user
            # user.is_instructor = False
            # user.save()

        self.message_user(request, "{}건의 License Deleted 상태로 변경".format(update_license))


admin.site.register(License, LicenseAdmin)
