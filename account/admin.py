from django.contrib import admin
from account.models import User


class UserAdmin(admin.ModelAdmin):
    list_display = ["id", "email", "nickname", "is_instructor", "created_at"]


admin.site.register(User, UserAdmin)
