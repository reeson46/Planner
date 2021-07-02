from django.urls import path

from . import views

app_name = "dashboard"

urlpatterns = [
    path("", views.dashboard, name="home"),
    path("set_active_board/", views.set_active_board, name="set_active_board"),
    path("set_active_category/", views.set_active_category, name="set_active_category"),
    path("board_manager/", views.board_manager),
    path("category_manager/", views.category_manager),
    path('reload_tasks/', views.reload_tasks),
]
