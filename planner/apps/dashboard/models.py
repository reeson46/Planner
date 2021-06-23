from django.db import models
from django.utils.translation import gettext_lazy as _
from planner.apps.account.models import UserAccount


class Board(models.Model):
    name = models.CharField(max_length=255)
    created_by = models.ForeignKey(
        UserAccount, related_name="board", on_delete=models.CASCADE
    )

    class Meta:
        verbose_name = "Board"
        verbose_name_plural = "Boards"

    def categories(self):
        qs = self.category.all()
        result = []
        for x in qs:
            result.append(x.name)
        return result

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=250)
    board = models.ForeignKey(Board, related_name='category', on_delete=models.CASCADE)
    created_by = models.ForeignKey(
        UserAccount, related_name="category", on_delete=models.CASCADE
    )

    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")


    def __str__(self):
        return self.name