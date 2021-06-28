from django.forms import ModelForm
from django.forms.models import ModelChoiceField

from planner.apps.dashboard.dashboard import Dashboard
from planner.apps.dashboard.models import Board, Category

from .models import Task


class TaskForm(ModelForm):
    class Meta:
        model = Task
        fields = [
            "category",
            "status",
        ]

    def __init__(self, request, *args, **kwargs):
        super(TaskForm, self).__init__(*args, **kwargs)

        self.label_suffix = ""

        dashboard = Dashboard(request)
        active_board = Board.objects.get(pk=dashboard.get_active_board_id())
        category_qs = active_board.category.all()

        if not category_qs:
            category_label = "No Categories"
        else:
            category_label = None

        self.fields["category"] = ModelChoiceField(queryset=category_qs)
        self.fields["category"].empty_label = category_label
        self.fields["category"].widget.attrs.update(
            {
                "class": "card bg-dark text-light",
            }
        )

        self.fields["status"].widget.attrs.update(
            {
                "class": "card bg-dark text-light",
            }
        )
