from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("planner.apps.dashboard.urls", namespace="dashboard")),
    path("account/", include("planner.apps.account.urls", namespace="account")),
]
