
from django.shortcuts import redirect, render
from .models import Board
from .forms import BoardForm
from planner.apps.task.models import Task


def dashboard(request):
    tasks = Task.objects.all()

    planned = tasks.filter(status="Planned")
    in_progress = tasks.filter(status="In Progress")
    testing = tasks.filter(status="Testing")
    completed = tasks.filter(status="Completed")

    total_tasks = tasks.count()
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
        "total_tasks": total_tasks,
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

    return render(request, "dashboard:home", {'board'})