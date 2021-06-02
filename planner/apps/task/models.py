from django.db import models
from django.db.models.deletion import RESTRICT
from django.utils.translation import gettext_lazy as _

from planner.apps.account.models import UserAccount


# class Status(models.Model):
#     name = models.CharField(
#         max_length=250,
#         help_text=_("Enter a status, e.g. Planned, In progres,..."),
#         unique=True,
#     )

#     class Meta:
#         verbose_name = _("Status")
#         verbose_name_plural = _("Statuses")

#     def __str__(self):
#         return self.name


class Category(models.Model):
    name = models.CharField(max_length=250, unique=True)

    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=250, blank=True)

    class Meta:
        verbose_name = _("Tag")
        verbose_name_plural = _("Tags")

    def __str__(self):
        return self.name


class Task(models.Model):
    STATUS = (
        ("Planned", "Planned"),
        ("In Progress", "In Progress"),
        ("Testing", "Testing"),
        ("Completed", "Completed"),
    )
    category = models.ForeignKey(Category, on_delete=models.RESTRICT)
    status = models.CharField(max_length=50, choices=STATUS)
    name = models.CharField(max_length=250, blank=True)
    created_by = models.ForeignKey(UserAccount, on_delete=models.RESTRICT)
    description = models.TextField(max_length=500, blank=True)
    tags = models.ManyToManyField(Tag, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Task")
        verbose_name_plural = _("Tasks")

    def __str__(self):
        return self.name


class Subtask(models.Model):
    name = models.CharField(max_length=250, blank=True)
    task = models.ForeignKey(Task, related_name="subtasks", on_delete=models.CASCADE)
    is_complete = models.BooleanField(default=False)

    class Meta:
        verbose_name = _("Subtask")
        verbose_name_plural = _("Subtasks")

    def __str__(self):
        return self.name
