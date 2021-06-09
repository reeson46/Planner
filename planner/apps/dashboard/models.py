from django.db import models

from planner.apps.account.models import UserAccount


class Board(models.Model):
    name = models.CharField(max_length=255)
    created_by = models.ForeignKey(
        UserAccount, related_name="board", on_delete=models.CASCADE
    )

    class Meta:
        verbose_name = "Board"
        verbose_name_plural = "Boards"

    def __str__(self):
        return self.name
