from django import forms
from django.forms import ModelForm
from planner.apps.task.models import Task, Subtask


class TaskForm(ModelForm):
    class Meta:
        model = Task
        fields = ["category", "status", "name", "created_by"]
        widgets = {
            "created_by": forms.HiddenInput(),
        }


class SubtaskForm(ModelForm):
    class Meta:
        model = Subtask
        fields = ["name"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["name"].widget.attrs.update(
            {
                "class": "sub card mb-2 col-sm-10",
                "placeholder": "Subtask",
            }
        )
        self.fields["name"].label = ""
