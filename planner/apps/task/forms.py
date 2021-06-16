from django.forms import ModelForm
from django.forms.models import ModelChoiceField
from planner.apps.dashboard.models import Board
from .models import Category, Task


class TaskForm(ModelForm):
    class Meta:
        model = Task
        fields = [
            "category",
            "status",
        ]

    def __init__(self, user, *args, **kwargs):
        super(TaskForm, self).__init__(*args, **kwargs)

        self.label_suffix = ""

        category_qs = Category.objects.filter(created_by=user)

        if not category_qs:
            category_label = 'No Categories'
        else:
            category_label = None
            
        self.fields['category'] = ModelChoiceField(queryset=category_qs)
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
