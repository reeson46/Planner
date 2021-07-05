from rest_framework import serializers

from .models import Subtask, Task


class SubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtask
        fields = "__all__"


class TaskSerializer(serializers.ModelSerializer):
    subtask = SubtaskSerializer(many=True)
    created_by = serializers.ReadOnlyField(source="created_by.user_name")

    class Meta:
        model = Task
        fields = "__all__"
