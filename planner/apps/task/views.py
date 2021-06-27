
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.core import serializers
from planner.apps.dashboard.dashboard import Dashboard
from planner.apps.dashboard.models import Board, Category
from planner.apps.dashboard.dashboard import Sidebar

from .models import Subtask, Task


def new_task(request):

    if request.method == "GET":

        dashboard = Dashboard(request)

        active_board = Board.objects.get(pk=dashboard.get_active_board_id())
        
        categories = active_board.category.all()

        active_category_id = dashboard.get_active_category_id()

        if categories:
            categories_json = serializers.serialize('json',active_board.category.all())

            if active_category_id == -1 or not categories.filter(pk=active_category_id).exists():
                active_cat = categories.first()
                active_category = active_cat.id
            else:
                active_cat = categories.get(pk=active_category_id)
                active_category = active_cat.id
        else:
            active_category = None
            categories_json = None

        response = {
            'categories': categories_json,
            'category_id': active_category,
            'board_name': active_board.name,
            "is_edit": "False",
            "button": "Create",
        }

        return JsonResponse(response)


def edit_task(request):

    if request.method == "GET":

        dashboard = Dashboard(request)

        active_board = Board.objects.get(pk=dashboard.get_active_board_id())

        task_id = request.GET.get('task_id')

        t = Task.objects.get(pk=task_id)
        statuses = [s[0] for s in Task.STATUS]

        categories = serializers.serialize('json', active_board.category.all())
        task = serializers.serialize('json', [t])
        subtasks = serializers.serialize('json', t.subtask.all())

        response = {
            'board_name': t.board.name,
            'category_id': t.category.id,
            'categories': categories,
            'statuses': statuses,
            'task': task,
            "subtasks": subtasks,
            "is_edit": "True",
            "button": "Update",
        }
        
        return JsonResponse(response)


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
        is_edit = request.POST.get("is_edit")

        """
        CREATING A NEW TASK
        """
        # if edit is false, meaning we are creating a new task
        if is_edit == "False":
            
            active_board = Board.objects.get(pk=dashboard.get_active_board_id())
            active_category_id = category.id
            dashboard.set_active_category_id(active_category_id)

            task = Task.objects.create(
                board=active_board,
                category=category,
                status=status,
                name=name,
                description=description,
                created_by=user,
            )
            
            if subtasks:
                for sub in subtasks:
                    Subtask.objects.create(name=sub, task=task)

            
            sidebar = Sidebar()

            response = {
                "message": "Task Created!",
                'active_category_id': active_category_id,
            }

            response.update(sidebar.categories_reload_json_response(active_board))

        """
        UPDATING EXISTING TASK
        """
        # if update is "true", meaning we are updating/editing existing task
        if is_edit == "True":

            deleted_subtasks = request.POST.getlist("deleted_subtasks[]")

            # if any existing subtasks were added to array
            if deleted_subtasks:
                # delete them
                for sub in deleted_subtasks:
                    Subtask.objects.get(pk=sub).delete()
                    
                    
            task = Task.objects.get(pk=request.POST.get("task_id"))
            task.category = category
            task.status = status
            task.name = name
            task.description = description
            task.save()

            if subtasks:
                for sub in subtasks:
                    if Subtask.objects.filter(name=sub, task=task).exists():
                        pass
                    else:
                        Subtask.objects.create(name=sub, task=task)

            response = {"message": "Task Updated!"}

        return JsonResponse(response)



def delete_task(request, pk):
    task = Task.objects.get(pk=pk)

    if request.method == "POST":
        task.delete()
        return redirect("dashboard:home")

    return render(request, "dashboard/task/delete_task.html", {"task": task})


def set_task_extend_state(request):
    if request.POST.get("action") == "post":
        task_id = request.POST.get("task_id")
        new_state = request.POST.get("task_extend_state")

        task = Task.objects.get(pk=task_id)
        task.extend_state = new_state
        task.save()

        return JsonResponse({"message": "Task extend state updated!"})
