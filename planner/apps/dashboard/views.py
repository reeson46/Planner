from planner.apps.account.account import Account
from django.http.response import JsonResponse
from django.shortcuts import render

from planner.apps.task.models import Category
from planner.apps.task.task import Task
from .dashboard import Dashboard, Sidebar
from .models import Board


def dashboard(request):
    dashboard = Dashboard(request)
    account = Account(request)

    if request.user.is_authenticated:
        is_guest = False
    else:
        is_guest = True

    user = account.getUser()
    boards = user.board.all()


    # if the session in not empty
    if not dashboard.session_check():

        #add all board to the session
        dashboard.add_all_boards(boards)

        # grab the first board from the Board model
        # and set the first board as active
        active_board = boards.first()

        # save the board's id as "active board" into the session
        dashboard.set_active_board_id(active_board.id)
        highlighted_board = active_board.id

        # set active category as ALL (-1)
        dashboard.set_active_category_id(active_board.id, -1)
        highlighted_category = -1

        # get the tasks
        tasks = active_board.task.all()
     
    # but if there is already something in the session
    else:
        # get the active board
        if not Board.objects.filter(pk=dashboard.get_active_board_id()).exists():
            active_board = boards.order_by("-id")[0]

        else:
            active_board = Board.objects.get(pk=dashboard.get_active_board_id())

        highlighted_board = active_board.id

        # get the active category
        active_category_id = int(dashboard.get_active_category_id(active_board.id))
        if active_category_id == -1:
            tasks = active_board.task.all()
            highlighted_category = -1
        else: 
            category = Category.objects.get(pk=active_category_id)
            highlighted_category = category.id
                
            # get the tasks
            tasks = category.task.all()


    categories = active_board.category.all()
 
    statuses = ["Planned", "In Progress", "Testing", "Completed"]
    planned = tasks.filter(status="Planned")
    in_progress = tasks.filter(status="In Progress")
    testing = tasks.filter(status="Testing")
    completed = tasks.filter(status="Completed")

    task = Task()
    completed_subtasks = task.getCompletedSubtasks(tasks)
    task_ids = task.getTaskIds(tasks)

    context = {
        'total_tasks': user.task.all(),
        "tasks": tasks,
        "boards": boards,
        "categories": categories,
        "statuses": statuses,
        "planned": planned,
        "in_progress": in_progress,
        "testing": testing,
        "completed": completed,
        "highlighted_board": highlighted_board,
        "highlighted_category": highlighted_category,
        'task_ids': task_ids,
        "completed_subtasks": completed_subtasks,
        'is_guest': is_guest
    }

    return render(request, "dashboard/dashboard.html", context)


def set_active_board(request):

    if request.POST.get("action") == "post":

        dashboard = Dashboard(request)
        board_id = request.POST.get("board_id")

        if (board_id != dashboard.get_active_board_id()):

            sidebar = Sidebar()
            dashboard.set_active_board_id(board_id)
            active_category_id = dashboard.get_active_category_id(board_id)

            active_board = Board.objects.get(pk=board_id)
            response = sidebar.categories_reload_json_response(active_board)
            response.update({
                'reload': True,
                'active_category_id': active_category_id,
            })

        else:
            response = {"reload": False}

        return JsonResponse(response)


def set_active_category(request):

    if request.POST.get("action") == "post":
        category_id = request.POST.get("category_id")

        dashboard = Dashboard(request)
        board_id = dashboard.get_active_board_id()

        if (category_id != dashboard.get_active_category_id(board_id)):
            dashboard.set_active_category_id(
                board_id,
                category_id
            )

            response = {"reload": True}
        else:

            response = {"reload": False}

        return JsonResponse(response)


def board_manager(request):
    dashboard = Dashboard(request)
    
    """
    ADD
    """
    if request.POST.get("action") == "add":
        name = request.POST.get("name")
        
        account = Account(request)
        user = account.getUser()

        board = Board.objects.create(name=name, created_by=user)

        dashboard.add_board(board.id)
        dashboard.set_active_board_id(board.id)

        sidebar = Sidebar()
        response = sidebar.boards_reload_json_response(request)
        response.update(
            {
                "message": 'Board "' + name + '" created',
                "active_board_id": board.id,
            }
        )

    """
    RENAME
    """
    if request.POST.get("action") == "rename":
        name = request.POST.get("name")
        board = Board.objects.get(pk=request.POST.get("id"))
        board.name = name
        board.save()

        response = {"message": "Board renamed", "name": name}

    """
    DELETE
    """
    if request.POST.get("action") == "delete":

        board_id = request.POST.get("id")
        
        board = Board.objects.get(pk=board_id)
        board.delete()
        
        user = request.user
        boards = user.board.all()

        # check if the active board is the same as the one we just deleted
        if dashboard.get_active_board_id() == board_id:
            # if so, then grab the last created board and set it as active
            active_board = boards.order_by("-id")[0]
            dashboard.set_active_board_id(active_board.id)
        else:
            active_board = boards.get(pk=dashboard.get_active_board_id())
            dashboard.set_active_board_id(active_board.id)
        
        active_category_id = dashboard.get_active_category_id(active_board.id)

        # remove deleted board from session
        dashboard.remove_board(board_id)

        sidebar = Sidebar()
        response = sidebar.boards_reload_json_response(request)
        response.update(sidebar.categories_reload_json_response(active_board))
        response.update({
            "message": "Board deleted", 
            "active_board_id": active_board.id,
            'active_category_id': active_category_id
        })

    return JsonResponse(response)


def category_manager(request):
    dashboard = Dashboard(request)

    """
    ADD
    """
    if request.POST.get("action") == "add":
        
        account = Account(request)
        user = account.getUser()

        name = request.POST.get("name")

        active_board = Board.objects.get(pk=dashboard.get_active_board_id())

        category = Category.objects.create(
            name=name, board=active_board, created_by=user
        )

        active_category_id = dashboard.get_active_category_id(active_board.id)

        response = {
            "message": 'Category "' + name + '" created',
            "added_category_id": category.id,
            "active_category_id": active_category_id,
            
        }

        sidebar = Sidebar()
        response.update(sidebar.categories_reload_json_response(active_board))

        if not request.user.is_authenticated:
            response.update({
                'total_categories': user.category.all().count(),
                'is_guest': True
            })

    """
    RENAME
    """
    if request.POST.get("action") == "rename":

        name = request.POST.get("name")
        pk = request.POST.get("id")

        category = Category.objects.get(pk=pk)
        category.name = name
        category.save()

        response = {"message": "Category renamed"}

    """
    DELETE
    """
    if request.POST.get("action") == "delete":

        account = Account(request)
        user = account.getUser()

        pk = request.POST.get("id")

        category = Category.objects.get(pk=pk)
        category.delete()

        active_board = Board.objects.get(pk=dashboard.get_active_board_id())
        dashboard.set_active_category_id( active_board.id, -1)

        sidebar = Sidebar()
        response = sidebar.categories_reload_json_response(active_board)

        if not request.user.is_authenticated:
            response.update({
                'total_categories': user.category.all().count(),
                'is_guest': True
            })

    return JsonResponse(response)


def reload_tasks(request):
    if request.method == "GET":

        dashboard = Dashboard(request)
        active_aboard_id = dashboard.get_active_board_id()
        active_category_id = int(dashboard.get_active_category_id(active_aboard_id))

        active_aboard = Board.objects.get(pk=active_aboard_id)

        task = Task()
        response = task.tasks_reload_json_response(active_category_id, active_aboard)

        return JsonResponse(response)


def guest_limitation(request):
    pass