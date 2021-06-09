from django.apps import AppConfig


class DashboardConfig(AppConfig):
    name = "planner.apps.dashboard"

    def ready(self):
        import planner.apps.dashboard.signals
