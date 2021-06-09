from django.db.models.signals import post_save
from django.dispatch import receiver

from planner.apps.account.models import UserAccount

from .models import Board


@receiver(post_save, sender=UserAccount)
def create_board(sender, instance, created, **kwargs):
    if created:
        Board.objects.create(created_by=instance, name="Board 1")
