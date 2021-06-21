from django.http import JsonResponse
from django.shortcuts import redirect, render

from planner.apps.dashboard.dashboard import Dashboard
from planner.apps.dashboard.models import Board

from .forms import TaskForm
from .models import Category, Subtask, Task


def new_task(request):
    dashboard = Dashboard(request)
    user = request.user
    categories = user.category.all()

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
        user=user
    )
    context = {
        'form': form,
        "button_value": "Create",
        "update": False,
        "button": "Create",
    }
    return render(request, "dashboard/task/new_task.html", context)


def create_task(request):
    dashboard = Dashboard(request)

    if request.POST.get("action") == "post":
        
        if request.POST.get("status") is None:
            status = 'Planned'
        else:
            status = request.POST.get("status")

        board = Board.objects.get(pk=dashboard.get_active_board_id())
        
        category = Category.objects.get(pk=request.POST.get("category"))
        category.board.add(board)

        name = request.POST.get("name")

        description = request.POST.get("description")

        user = request.user

        subtasks = request.POST.getlist("subtasks[]")

        update = request.POST.get("update")

        if update == "False":
            
            
            task = Task.objects.create(
                board=board,
                category=category,
                status=status,
                name=name,
                description=description,
                created_by=user,
            )

            for sub in subtasks:
                Subtask.objects.create(name=sub, task=task.id)

            response = JsonResponse({"message": "Task Created!"})

        if update == "True":
            
            active_category = Category.objects.get(pk=dashboard.get_active_category_id())

            # if the active category is not the same as request category
            if active_category != category:
                # add this board to this new category to make a relationship
                category.board.add(board)
                
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
