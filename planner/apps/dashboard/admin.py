from django.contrib import admin

from .models import Board


class BoardAdminConfig(admin.ModelAdmin):
    model = Board
    search_fields = (
        "name",
        "created_by",
    )
    list_filter = (
        "name",
        "created_by",
    )
    list_display = (
        "name",
        "created_by",
    )


admin.site.register(Board, BoardAdminConfig)
