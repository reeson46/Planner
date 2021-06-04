from django.forms import ModelForm

from .models import Task


class TaskForm(ModelForm):
    class Meta:
        model = Task
        fields = [
            "category",
            "status",
        ]

    def __init__(self, *args, **kwargs):
        super(TaskForm, self).__init__(*args, **kwargs)

        self.fields["category"].widget.attrs.update(
            {
                "class": "card",
                "id": "category",
            }
        )
        self.fields["category"].empty_label = None
        self.fields["status"].widget.attrs.update(
            {
                "class": "card",
                "id": "status",
            }
        )
