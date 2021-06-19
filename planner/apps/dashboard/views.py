
from planner.apps.task.models import Category
from django.http.response import JsonResponse
from django.shortcuts import render

from .dashboard import Dashboard, Sidebar
from .models import Board


def dashboard(request):
    if not request.user.is_authenticated:
        return render(request, "dashboard/dashboard.html")

    user = request.user
    boards = user.board.all()
    
    # make the session instance
    dashboard = Dashboard(request)

    # if there is no active board in the session
    if not dashboard.active_board_check():

        # grab the first board from the Board model
        first_board = boards.first()

        # if there is no active category
        if not dashboard.active_category_check():

            # set active category as ALL (-1)
            dashboard.set_active_category_id(category_id=-1)

            highlighted_category = -1

        # save the board id as "active board" into the session
        dashboard.set_active_board_id(board_id=first_board.id)

        highlighted_board = first_board.id

        # and set the first board as active
        active_board = first_board

        tasks = active_board.task.all()

    # but if there is already "active board" in the session
    else:
        # grab the id from the session
        active_board_id = dashboard.get_active_board_id()

        # if for some reason the "active board" has been deleted
        if not boards.filter(pk=active_board_id).exists():

            # get the last entry and set it as "active board"
            active_board = boards.order_by('-id')[0]
        else:
            # else just get whichever is active
            active_board = boards.get(pk=active_board_id)
        
        dashboard.set_active_board_id(active_board.id)

        # get the category id
        active_category_id = dashboard.get_active_category_id()

        highlighted_category = active_category_id
        highlighted_board = active_board.id

        # if the active category is ALL
        if int(dashboard.get_active_category_id()) == -1:

            # get all the tasks
            tasks = active_board.task.all()
        else:
            # get only the tasks associated with active category
            tasks = active_board.task.filter(category=active_category_id)
    
    total_tasks = active_board.task.all()
    
    categories = active_board.category.all()

    total_tasks_per_category = [len(category.task.filter(board=active_board)) for category in categories]

    planned = tasks.filter(status="Planned")
    in_progress = tasks.filter(status="In Progress")
    testing = tasks.filter(status="Testing")
    completed = tasks.filter(status="Completed")

    context = {
        "tasks": tasks,
        'total_tasks': total_tasks,
        "boards": boards,
        "categories": categories,
        "planned": planned,
        "in_progress": in_progress,
        "testing": testing,
        "completed": completed,
        "highlighted_board": highlighted_board,
        "highlighted_category": highlighted_category,
        'total_tasks_per_category': total_tasks_per_category
    }

    return render(request, "dashboard/dashboard.html", context)


def board_category(request):

    dashboard = Dashboard(request)

    """
    ADDING
    """
    if request.POST.get('action') == 'add':

        # Add Board
        if request.POST.get('type') == 'board':
            name = request.POST.get('name')
            user = request.user
            board = Board.objects.create(
                name=name,
                created_by=user
            )

            dashboard.set_active_board_id(board.id)
            response = {
                'message': 'Category "'+name+'" created',
            }

        # Add Category
        if request.POST.get('type') == 'category':
            name = request.POST.get('name')
            user = request.user
            category = Category.objects.create(
                name=name,
                created_by=user
            )

            dashboard.set_active_category_id(category.id)
            response = {
                'message': 'Category "'+name+'" created',
            }
        
        return JsonResponse(response)
    
    """
    RENAMING
    """
    if request.POST.get('action') == 'rename':
        
        dashboard = Dashboard(request)
        sidebar = Sidebar(active_board=None, request=request)

        # Rename Board
        if request.POST.get('type') == 'board':
            name = request.POST.get('name')
            board = Board.objects.get(pk=request.POST.get('id')) 
            board.name = name
            board.save()

            response = sidebar.boards_reload_json_response()
            response['active_board_id'] = int(dashboard.get_active_board_id())
        
        # Rename Category
        if request.POST.get('type') == 'category':
            name = request.POST.get('name')
            category = Category.objects.get(pk=request.POST.get('id'))
            category.name = name
            category.save()

            response = {'message': 'Category renamed', 'name': name}
        
        return JsonResponse(response)
    
    """
    DELETING
    """
    if request.POST.get('action') == 'delete':
        
        # Delete Board
        if request.POST.get('type') == 'board':

            board = Board.objects.get(pk=request.POST.get('id'))
            board.delete()

            user = request.user
            boards = user.board.all()
            
            # check is the active board is the same as the one we just deleted
            if dashboard.get_active_board_id() == int(request.POST.get('id')):
                # if so, then grab the last created board and set it as active
                active_board = boards.order_by('-id')[0]
            else:
                active_board = boards.get(pk=dashboard.get_active_board_id())

            sidebar = Sidebar(active_board=active_board, request=None)

            response = sidebar.categories_reload_json_response()
            response['active_board_id'] = active_board.id

        return JsonResponse(response)
        


def set_active_board(request):

    if request.POST.get("action") == "post":

        dashboard = Dashboard(request)

        board_id = int(request.POST.get("board_id"))
        dashboard.set_active_board_id(board_id=board_id)
        dashboard.set_active_category_id(category_id=-1)
        active_board = Board.objects.get(pk=board_id)

        sidebar = Sidebar(active_board, request=None)
        response = sidebar.categories_reload_json_response()

        return JsonResponse(response)


def set_active_category(request):
    dashboard = Dashboard(request)

    if request.POST.get("action") == "post":
        category_id = int(request.POST.get("category_id"))
        dashboard.set_active_category_id(category_id=category_id)

        return JsonResponse({"message": "Active category set!"})

def test(request):
    return render(request, 'test.html')
