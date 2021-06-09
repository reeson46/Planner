from django.http import JsonResponse
from django.shortcuts import redirect, render

from planner.apps.account.models import UserAccount
from planner.apps.dashboard.dashboard import Dashboard
from planner.apps.dashboard.models import Board

from .forms import TaskForm
from .models import Category, Subtask, Task


def new_task(request):
    dashboard = Dashboard(request)
    user = request.user
    categories = user.category.all()

    if dashboard.get_active_category_id() == -1:
        active_category = categories.first()
    else:
        active_category = categories.get(pk=dashboard.get_active_category_id())

    form = TaskForm(
        initial={
            "board": dashboard.get_active_board_id,
            "category": active_category.id,
        }
    )
    context = {
        "form": form,
        "button_value": "Create",
        "update": False,
        "button": "Create",
    }
    return render(request, "dashboard/task/new_task.html", context)


def create_task(request):
    dashboard = Dashboard(request)

    if request.POST.get("action") == "post":
        update = request.POST.get("update")

        board = Board.objects.get(pk=dashboard.get_active_board_id())

        category = Category.objects.get(pk=request.POST.get("category"))

        status = request.POST.get("status")
        name = request.POST.get("name")

        description = request.POST.get("description")

        user = UserAccount.objects.get(pk=request.user.id)

        subtasks = request.POST.getlist("subtasks[]")

        if update == "False":
            task = Task.objects.create(
                board=board,
                category=category,
                status=status,
                name=name,
                description=description,
                created_by=user,
            )
            # task_id = task.id
            created_task = Task.objects.get(pk=task.id)

            for sub in subtasks:
                Subtask.objects.create(name=sub, task=created_task)

            response = JsonResponse({"message": "Task Created!"})

        if update == "True":
            task = Task.objects.get(pk=request.POST.get("task_id"))
            task.category = category
            task.status = status
            task.name = name
            task.description = description
            task.save()

            for sub in subtasks:
                if Subtask.objects.filter(name=sub, task=task).exists():
                    pass
                else:
                    Subtask.objects.create(name=sub, task=task)

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

def set_task_extend_state(request):
    if request.POST.get('action') == 'post':
        task_id = request.POST.get('task_id')
        new_state = request.POST.get('task_extend_state')

        task = Task.objects.get(pk=task_id)
        task.extend_state = new_state
        task.save()

        return JsonResponse({'message': 'Task extend state updated!'})
