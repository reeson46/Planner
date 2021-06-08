from django.urls import path

from . import views

app_name = "dashboard"

urlpatterns = [
    path("", views.dashboard, name="home"),
    path("new_board/", views.new_board, name="new_board"),
    #path('rename_board/<str:pk>/', views.rename_board, name="rename_board"),
    path('set_active_board/', views.set_active_board, name='set_active_board'),
    path('set_active_category/', views.set_active_category, name='set_active_category'),
    

]
