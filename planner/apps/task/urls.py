from django.urls import path

from . import views

app_name = "task"

urlpatterns = [
    path("new_task/", views.new_task, name="new_task"),
    path("create_task/", views.create_task, name="create_task"),
    path("update_task/<str:pk>/", views.update_task, name="update_task"),
    path("delete_task/<str:pk>/", views.delete_task, name="delete_task"),
    path("delete_subtask/", views.delete_subtask, name="delete_subtask"),
    path(
        "set_task_extend_state/",
        views.set_task_extend_state,
        name="set_task_extend_state",
    ),
]
