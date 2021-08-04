from django.http import JsonResponse

from planner.apps.account.account import Account
from planner.apps.dashboard.dashboard import Dashboard, Sidebar
from planner.apps.dashboard.models import Board, Category
from planner.apps.dashboard.serializers import CategorySerializer

from .models import Subtask, Task
from .serializers import TaskSerializer


def new_task(request):

    if request.method == "GET":

        dashboard = Dashboard(request)

        active_board = Board.objects.get(pk=dashboard.get_active_board_id())

        categories = active_board.category.all()

        active_category_id = int(dashboard.get_active_category_id(active_board.id))

        if categories:
            categories_json = CategorySerializer(active_board.category.all(), many=True)
            categories_data = categories_json.data

            if (
                active_category_id == -1
                or not categories.filter(pk=active_category_id).exists()
            ):
                active_cat = categories.first()
                active_category = active_cat.id
            else:
                active_cat = categories.get(pk=active_category_id)
                active_category = active_cat.id
        else:
            active_category = None
            categories_data = None

        response = {
            "categories": categories_data,
            "category_id": active_category,
            "board_name": active_board.name,
            "is_edit": "False",
            "button": "Create",
        }

        return JsonResponse(response)


def edit_task(request):

    if request.method == "GET":

        dashboard = Dashboard(request)

        active_board = Board.objects.get(pk=dashboard.get_active_board_id())

        task_id = request.GET.get("task_id")

        t = Task.objects.get(pk=task_id)
        statuses = ["Planned", "In Progress", "Testing", "Completed"]

        categories = CategorySerializer(active_board.category.all(), many=True)
        task = TaskSerializer(t, many=False)

        response = {
            "board_name": t.board.name,
            "category_id": t.category.id,
            "categories": categories.data,
            "statuses": statuses,
            "task": task.data,
            "is_edit": "True",
            "button": "Update",
        }

        return JsonResponse(response)


def task_manager(request):
    dashboard = Dashboard(request)

    if request.POST.get("action") == "post":

        if request.POST.get("status") is None:
            status = "Planned"
        else:
            status = request.POST.get("status")

        category = Category.objects.get(pk=request.POST.get("category"))

        name = request.POST.get("name")
        description = request.POST.get("description")

        account = Account(request)
        user = account.getUser()
        subtasks = request.POST.getlist("subtasks[]")
        is_edit = request.POST.get("is_edit")

        """
        CREATING A NEW TASK
        """
        # if edit is false, meaning we are creating a new task
        if is_edit == "False":

            active_board = Board.objects.get(pk=dashboard.get_active_board_id())
            active_category_id = category.id
            dashboard.set_active_category_id(active_board.id, active_category_id)

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
                "active_category_id": active_category_id,
            }

            response.update(sidebar.categories_reload_json_response(active_board))

            if not request.user.is_authenticated:
                response["is_guest"] = True
            else:
                response["is_guest"] = False

        """
        UPDATING EXISTING TASK
        """
        # if update is "true", meaning we are updating/editing existing task
        if is_edit == "True":

            deleted_subtasks = request.POST.getlist("deleted_subtasks[]")

            # if any existing subtasks were added to the "deletion" array
            if deleted_subtasks:
                # delete them
                for sub in deleted_subtasks:
                    Subtask.objects.get(pk=sub).delete()

            task = Task.objects.get(pk=request.POST.get("task_id"))
            current_task_category = task.category
            task.category = category
            task.status = status
            task.name = name
            task.description = description
            task.save()

            if subtasks:
                for sub in subtasks:
                    Subtask.objects.create(name=sub, task=task)

            # if subtasks:
            #     for sub in subtasks:
            #         if Subtask.objects.filter(name=sub, task=task).exists():
            #             pass
            #         else:
            #             Subtask.objects.create(name=sub, task=task)

            response = {"message": "Task Updated!"}

            # if also the category has been changed
            if category != current_task_category:
                sidebar = Sidebar()
                # update the response so that the sidebar categories can be reloaded
                response.update(sidebar.categories_reload_json_response(task.board))
                response["category_change"] = "True"
                response["active_category_id"] = dashboard.get_active_category_id(
                    task.board.id
                )

        return JsonResponse(response)


def delete_task(request):
    if request.method == "POST":

        task_id = request.POST.get("task_id")
        task = Task.objects.get(pk=task_id)
        board = task.board
        task.delete()

        sidebar = Sidebar()
        dashboard = Dashboard(request)

        response = sidebar.categories_reload_json_response(board)
        response["active_category_id"] = dashboard.get_active_category_id(board.id)

        if not request.user.is_authenticated:
            response["is_guest"] = True
        else:
            response["is_guest"] = False

        return JsonResponse(response)


def set_task_extend_state(request):
    if request.POST.get("action") == "post":
        task_id = request.POST.get("task_id")
        new_state = request.POST.get("task_extend_state")

        task = Task.objects.get(pk=task_id)
        task.extend_state = new_state
        task.save()

        return JsonResponse({"message": "Task extend state updated!"})


def subtask_manager(request):
    if request.method == "POST":

        is_complete = request.POST.get("is_complete")

        if is_complete == "true":
            complete = True
        if is_complete == "false":
            complete = False

        subtask_id = request.POST.get("subtask_id")
        subtask = Subtask.objects.get(pk=subtask_id)

        subtask.is_complete = complete
        subtask.save()

        return JsonResponse(
            {"message": 'Subtask "is_complete" field changed to ' + is_complete}
        )


def status_manager(request):
    if request.method == "POST":

        task_id = request.POST.get("task_id")
        status = request.POST.get("new_status")

        task = Task.objects.get(pk=task_id)
        task.status = status
        task.save()

        return JsonResponse({"message": task.name + " status changed to " + status})
