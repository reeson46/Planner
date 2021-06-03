from django.urls import path

from . import views

app_name = "dashboard"

urlpatterns = [
    path("", views.dashboard, name="home"),
    path("add_task/", views.add_task, name="add_task"),
    path("update_task/<str:pk>/", views.update_task, name="update_task"),
    path("delete_task/<str:pk>/", views.delete_task, name="delete_task"),
    path('delete_subtask/', views.delete_subtask, name="delete_subtask"),

]
