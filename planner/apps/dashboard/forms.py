from django import forms
from django.forms import ModelForm

from .models import Board, Category


class BoardForm(ModelForm):
    class Meta:
        model = Board
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(BoardForm, self).__init__(*args, **kwargs)

        self.fields["name"].widget.attrs.update(
            {"class": "card", "placeholder": "Name"}
        )
        self.fields["name"].label = False
        self.fields["created_by"].widget = forms.HiddenInput()


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
