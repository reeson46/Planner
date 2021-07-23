from django.contrib.auth import views as auth_views
from django.urls import path
from django.views.generic.base import TemplateView

from . import views
from .forms import PwdResetConfirmForm, PwdResetForm

app_name = "account"

urlpatterns = [
    path("login/", views.account_login, name="login"),
    path("logout/", auth_views.LogoutView.as_view(next_page="/"), name="logout"),
    path("register/", views.account_register, name="register"),
    path("activate/<str:uidb64>/<str:token>/", views.account_activate, name="activate"),
    path(
        "password_reset/",
        auth_views.PasswordResetView.as_view(
            template_name="account/password/password_reset_form.html",
            success_url="password_reset_email_confirm/",
            email_template_name="account/password/passoword_reset_email.html",
            form_class=PwdResetForm,
        ),
        name="pwdreset",
    ),
    path(
        "password_reset_confirm/<uidb64>/<token>",
        auth_views.PasswordResetConfirmView.as_view(
            template_name="account/password/password_reset_confirm.html",
            success_url="/account/password_reset_complete/",
            form_class=PwdResetConfirmForm,
        ),
        name="password_reset_confirm",
    ),
    path(
        "password_reset/password_reset_email_confirm/",
        TemplateView.as_view(template_name="account/password/reset_status.html"),
        name="password_reset_done",
    ),
    path(
        "password_reset_complete/",
        TemplateView.as_view(template_name="account/password/reset_status.html"),
        name="password_reset_complete",
    ),
    path("update_account/", views.update_account, name="update_account"),
]
