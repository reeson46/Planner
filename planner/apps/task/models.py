from django.db import models
from django.utils.translation import gettext_lazy as _

from planner.apps.account.models import UserAccount
from planner.apps.dashboard.models import Board, Category


class Task(models.Model):
    STATUS = (
        ("Planned", "Planned"),
        ("In Progress", "In Progress"),
        ("Testing", "Testing"),
        ("Completed", "Completed"),
    )
    board = models.ForeignKey(Board, related_name="task", on_delete=models.CASCADE)
    category = models.ForeignKey(
        Category, related_name="task", on_delete=models.CASCADE
    )
    status = models.CharField(max_length=50, choices=STATUS, default="Planned")
    name = models.CharField(max_length=250)
    created_by = models.ForeignKey(
        UserAccount, related_name="task", on_delete=models.CASCADE
    )
    description = models.TextField(max_length=500, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    extend_state = models.IntegerField(default=0)

    class Meta:
        verbose_name = _("Task")
        verbose_name_plural = _("Tasks")

    def __str__(self):
        return self.name


class Subtask(models.Model):
    name = models.CharField(max_length=250, blank=True)
    task = models.ForeignKey(Task, related_name="subtask", on_delete=models.CASCADE)
    is_complete = models.BooleanField(default=False)

    class Meta:
        verbose_name = _("Subtask")
        verbose_name_plural = _("Subtasks")

    def __str__(self):
        return self.name
