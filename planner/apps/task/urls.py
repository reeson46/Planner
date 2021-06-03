from django.urls import path

from . import views

app_name = "task"

urlpatterns = [
    path('add_task/', views.add_task, name="add_task"),
    path('update_task/', views.update_task, name="update_task"),
    path('delete_task/', views.delete_task, name="delete_task"),
    path('add_subtask/', views.add_subtask, name="add_subtask"),
    path('delete_subtask/', views.delete_subtask, name="delete_subtask"),

]
