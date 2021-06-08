from django.forms import ModelForm

from .models import Task, Category


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
            }
        )
        self.fields["category"].empty_label = None
        self.fields["status"].widget.attrs.update(
            {
                "class": "card",
            }
        )

class CategoryForm(ModelForm):
    class Meta:
        model = Category
        fields = ['name']
    
    def __init__(self, *args, **kwargs):
        super(CategoryForm, self).__init__(*args, **kwargs)

        self.fields['name'].widget.attrs.update(
            {
                'class': 'card',
            }
        )
        self.fields['name'].empty_label = None