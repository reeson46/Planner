from django.contrib import admin

from .models import Board, Category


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
        "categories",
        "created_by",
    )


class CategoryAdminConfig(admin.ModelAdmin):
    model = Category
    list_display = ("name", "board", "created_by")


admin.site.register(Category, CategoryAdminConfig)
admin.site.register(Board, BoardAdminConfig)
