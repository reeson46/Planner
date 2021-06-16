from django.contrib import admin

from .models import Category, Subtask, Task


class SubtaskTabularInline(admin.TabularInline):
    model = Subtask


class TaskAdminConfig(admin.ModelAdmin):
    model = Task
    search_fields = (
        "board",
        "status",
        "category",
        "name",
        "created_by",
    )
    list_filter = (
        "board",
        "status",
        "category",
        "name",
        "created_by",
    )
    list_display = (
        "board",
        "category",
        "name",
        "created_by",
        "date_created",
        "status",
    )
    inlines = [SubtaskTabularInline]

class CategoryAdminConfig(admin.ModelAdmin):
    model = Category
    list_display = (
        'name',
        'created_by'
    )


admin.site.register(Category, CategoryAdminConfig)
admin.site.register(Task, TaskAdminConfig)
