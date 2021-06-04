from django.http import JsonResponse
from django.shortcuts import redirect, render

from planner.apps.account.models import UserAccount

from .forms import TaskForm
from .models import Category, Subtask, Task


def new_task(request):
    form = TaskForm()
    context = {
        "form": form,
        "button_value": "Create",
        "update": False,
        "button": "Create",
    }
    return render(request, "dashboard/task/new_task.html", context)


def create_task(request):
    if request.POST.get("action") == "post":
        update = request.POST.get("update")

        category_id = request.POST.get("category")
        category = Category.objects.get(pk=category_id)

        status = request.POST.get("status")
        name = request.POST.get("name")

        description = request.POST.get("description")

        user_id = request.user.id
        user = UserAccount.objects.get(pk=user_id)

        subtasks = request.POST.getlist("subtasks[]")

        if update == "False":
            task = Task.objects.create(
                category=category,
                status=status,
                name=name,
                description=description,
                created_by=user,
            )
            task_id = task.id
            created_task = Task.objects.get(pk=task_id)

            for sub in subtasks:
                Subtask.objects.get_or_create(name=sub, task=created_task)
            response = JsonResponse({"message": "Task Created!"})

        if update == "True":
            task_id = request.POST.get("task_id")
            task = Task.objects.get(pk=task_id)
            task.category = category
            task.status = status
            task.name = name
            task.description = description
            task.save()

            for sub in subtasks:
                Subtask.objects.get_or_create(name=sub, task=task)

            response = JsonResponse({"message": "Task Updated!"})

        return response


def update_task(request, pk):
    task = Task.objects.get(pk=pk)
    form = TaskForm(instance=task)

    context = {
        "form": form,
        "task": task,
        "update": True,
        "button": "Update",
    }
    return render(request, "dashboard/task/new_task.html", context)


def delete_task(request, pk):
    task = Task.objects.get(pk=pk)

    if request.method == "POST":
        task.delete()
        return redirect("dashboard:home")

    return render(request, "dashboard/task/delete_task.html", {"task": task})


def delete_subtask(request):
    if request.POST.get("action") == "post":
        subtask_id = request.POST.get("subtask_id")
        subtask = Subtask.objects.get(pk=subtask_id)
        subtask.delete()

        return JsonResponse({"message": "Subtask Deleted"})
