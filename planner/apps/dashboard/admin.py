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
        'categories',
        "created_by",
    )

    def categories(self, obj):
        return "\n".join([a.name for a in obj.category.all()])


admin.site.register(Board, BoardAdminConfig)
