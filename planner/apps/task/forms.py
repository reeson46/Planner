from django.forms import ModelForm

from .models import Category, Task


class TaskForm(ModelForm):
    class Meta:
        model = Task
        fields = [
            "board",
            "category",
            "status",
        ]

    def __init__(self, *args, **kwargs):
        super(TaskForm, self).__init__(*args, **kwargs)

        self.label_suffix = ""

        self.fields["board"].widget.attrs.update(
            {
                "class": "card bg-dark text-light",
            }
        )
        self.fields["board"].empty_label = None

        self.fields["category"].widget.attrs.update(
            {
                "class": "card bg-dark text-light",
            }
        )
        self.fields["category"].empty_label = None

        self.fields["status"].widget.attrs.update(
            {
                "class": "card bg-dark text-light",
            }
        )


class CategoryForm(ModelForm):
    class Meta:
        model = Category
        fields = ["name"]

    def __init__(self, *args, **kwargs):
        super(CategoryForm, self).__init__(*args, **kwargs)

        self.fields["name"].widget.attrs.update(
            {
                "class": "card",
            }
        )
        self.fields["name"].empty_label = None
