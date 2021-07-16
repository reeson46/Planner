from django.contrib.auth import views as auth_views
from django.urls import path

from . import views

app_name = "account"

urlpatterns = [
    path(
        "login/", views.account_login, name="login"),
    path(
        "logout/",
        auth_views.LogoutView.as_view(next_page="/"),
        name="logout",
    ),
    path("register/", views.account_register, name="register"),
    path("activate/<str:uidb64>/<str:token>/", views.account_activate, name="activate"),
    path('profile/', views.profile, name='profile'),
    path('update_profile', views.update_profile, name='update_profile')
]
