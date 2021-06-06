from django.urls import path

from . import views

app_name = "dashboard"

urlpatterns = [
    path("", views.dashboard, name="home"),
    path("new_board/", views.new_board, name="new_board"),
    path("view_board/<str:pk>/", views.view_board, name="view_board"),
    #path('rename_board/<str:pk>/', views.rename_board, name="rename_board"),
]
