from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.forms import Textarea

from .models import UserAccount


class UserAdminConfig(UserAdmin):
    model = UserAccount
    search_fields = (
        "email",
        "user_name",
        "first_name",
    )
    list_filter = (
        "email",
        "user_name",
        "first_name",
        "is_active",
        "is_staff",
    )
    ordering = ("-date_created",)
    list_display = ("email", "user_name", "first_name", "is_staff", "is_active")
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "email",
                    "user_name",
                    "first_name",
                    "last_name",
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_staff",
                    "is_active",
                )
            },
        ),
        ("Personal", {"fields": ("about",)}),
    )
    formfield_overrides = {
        UserAccount.about: {"widget": Textarea(attrs={"rows": 10, "cols": 40})}
    }
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "user_name",
                    "first_name",
                    "password1",
                    "password2",
                    "is_active",
                    "is_staff",
                ),
            },
        ),
    )


admin.site.register(UserAccount, UserAdminConfig)
