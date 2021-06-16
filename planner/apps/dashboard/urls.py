from django.urls import path

from . import views

app_name = "dashboard"

urlpatterns = [
    path("", views.dashboard, name="home"),
    path('board_category/', views.board_category, name='board_category'),
    path("set_active_board/", views.set_active_board, name="set_active_board"),
    path("set_active_category/", views.set_active_category, name="set_active_category"),
]
