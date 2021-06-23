from django.http import JsonResponse
from django.shortcuts import redirect, render

from planner.apps.dashboard.dashboard import Dashboard
from planner.apps.dashboard.models import Board, Category

from .forms import TaskForm
from .models import Subtask, Task


def new_task(request):
    dashboard = Dashboard(request)

    active_board = Board.objects.get(pk=dashboard.get_active_board_id())
    categories = active_board.category.all()

    active_category_id = dashboard.get_active_category_id()

    if categories:
        if active_category_id == -1 or not categories.filter(pk=active_category_id).exists():
            active_category = categories.first()
        else:
            active_category = categories.get(pk=active_category_id)
    else:
        active_category = None

    form = TaskForm(
        initial={
            "category": active_category,
            "status": "Planned",
        }, 
        request=request
    )
    context = {
        'form': form,
        'active_board': active_board,
        "button_value": "Create",
        "update": False,
        "button": "Create",
    }
    return render(request, "dashboard/task/new_task.html", context)


def task_manager(request):
    dashboard = Dashboard(request)

    if request.POST.get("action") == "post":
        
        if request.POST.get("status") is None:
            status = 'Planned'
        else:
            status = request.POST.get("status")

        
        category = Category.objects.get(pk=request.POST.get("category"))
        
        name = request.POST.get("name")
        description = request.POST.get("description")
        user = request.user
        subtasks = request.POST.getlist("subtasks[]")
        update = request.POST.get("update")

        """
        CREATING A NEW TASK
        """
        # if update is false, meaning we are creating a new task
        if update == "False":
            
            active_board = Board.objects.get(pk=dashboard.get_active_board_id())

            task = Task.objects.create(
                board=active_board,
                category=category,
                status=status,
                name=name,
                description=description,
                created_by=user,
            )

            for sub in subtasks:
                Subtask.objects.create(name=sub, task=task)

            response = JsonResponse({"message": "Task Created!"})
        
        """
        UPDATING EXISTING TASK
        """
        # if update is "true", meaning we are updating/editing existing task
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
    form = TaskForm(instance=task, user=request.user)

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
    if request.POST.get("action") == "post":
        task_id = request.POST.get("task_id")
        new_state = request.POST.get("task_extend_state")

        task = Task.objects.get(pk=task_id)
        task.extend_state = new_state
        task.save()

        return JsonResponse({"message": "Task extend state updated!"})
