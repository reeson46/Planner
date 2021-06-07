
from django.http.response import JsonResponse
from django.shortcuts import redirect, render
from .models import Board
from .forms import BoardForm
from planner.apps.task.models import Task
from .dashboard import Dashboard


def dashboard(request):
    user = request.user
    boards = user.board.all()

    # make the session
    dashboard = Dashboard(request)
    
    # if there is no active board in the session
    if not dashboard.active_board_check():

        # grab the first board from the Board model
        first_board = boards.first()

        # save the board id as "active board" into the session
        dashboard.set_active_board_id(board_id=first_board.id)

        # and set the first board as active
        active_board = first_board

    # but if there is already "active board" in the session
    else:
        # grab the id from the session
        active_board_id = dashboard.get_active_board_id()

        # and use it to get the board from Board model
        active_board = boards.get(pk=active_board_id)
    
    tasks = active_board.task.all()

    planned = tasks.filter(status="Planned")
    in_progress = tasks.filter(status="In Progress")
    testing = tasks.filter(status="Testing")
    completed = tasks.filter(status="Completed")

    total_planned = planned.count()
    total_inprogress = in_progress.count()
    total_testing = testing.count()
    total_completed = completed.count()

    context = {
        "planned": planned,
        "in_progress": in_progress,
        "testing": testing,
        "completed": completed,
        "total_planned": total_planned,
        "total_inprogress": total_inprogress,
        "total_testing": total_testing,
        "total_completed": total_completed,
        'boards': boards,
    }

    return render(request, "dashboard/dashboard.html", context)


def new_board(request):
    form = BoardForm(initial={'created_by': request.user})

    if request.method == 'POST':
        form = BoardForm(data=request.POST)
        if form.is_valid():
            form.save()
            return redirect('dashboard:home')

    context = {
        'form': form,
        'button': 'Create'
    }
    return render(request, 'dashboard/new_board.html', context)


def rename_board(request, pk):
    board = Board.objects.get(id=pk)
    form = BoardForm(instance=board)

    if request.method == "POST":
        form = BoardForm(request.POST, instance=board)
        if form.is_valid():
            form.save()
            return redirect('dashboard:home')
    
    context = {
        'form': form,
        'button': 'Update'
    }
    return render(request, 'dashboard/new_board.html', context)

def view_board(request, pk):
    board = Board.objects.get(id=pk)

    planned = board.task.filter(status="Planned")
    in_progress = board.task.filter(status="In Progress")
    testing = board.task.filter(status="Testing")
    completed = board.task.filter(status="Completed")

    total_planned = planned.count()
    total_inprogress = in_progress.count()
    total_testing = testing.count()
    total_completed = completed.count()

    user = request.user
    boards = user.board.all()

    context = {
        "planned": planned,
        "in_progress": in_progress,
        "testing": testing,
        "completed": completed,
        "total_planned": total_planned,
        "total_inprogress": total_inprogress,
        "total_testing": total_testing,
        "total_completed": total_completed,
        'boards': boards,
    }

    return render(request, "dashboard/dashboard.html", context)

def set_active_board(request):
    dashboard = Dashboard(request)

    if request.POST.get('action') == 'post':
        board_id = int(request.POST.get('board_id'))
        dashboard.set_active_board_id(board_id=board_id)


        return JsonResponse({'message': 'Active board set!'})