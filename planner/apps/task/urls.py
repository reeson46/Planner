from django.urls import path

from . import views

app_name = "task"

urlpatterns = [
    path("new_task/", views.new_task, name="new_task"),
    path("task_manager/", views.task_manager, name='task_manager'),
    path("edit_task/", views.edit_task, name="edit_task"),
    path("delete_task/<str:pk>/", views.delete_task, name="delete_task"),
    path(
        "set_task_extend_state/",
        views.set_task_extend_state,
        name="set_task_extend_state",
    ),
]
