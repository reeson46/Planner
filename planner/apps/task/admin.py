from django.contrib import admin

from .models import Category, Subtask, Tag, Task


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
        "tags",
    )
    list_filter = (
        "board",
        "status",
        "category",
        "name",
        "created_by",
        "tags",
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


admin.site.register(Category)
admin.site.register(Task, TaskAdminConfig)
admin.site.register(Tag)
