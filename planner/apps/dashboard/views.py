from django.http.response import JsonResponse
from django.shortcuts import redirect, render

from .dashboard import Dashboard
from .forms import BoardForm
from .models import Board


def dashboard(request):
    if not request.user.is_authenticated:
        return render(request, "dashboard/dashboard.html")

    user = request.user
    boards = user.board.all()
    categories = user.category.all()

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
        highlighted_board = active_board_id

        # and use it to get the board from Board model
        active_board = boards.get(pk=active_board_id)

        # get the category id
        active_category_id = dashboard.get_active_category_id()

        highlighted_category = active_category_id

        # if the active category is ALL
        if dashboard.get_active_category_id() == -1:

            # get all the tasks
            tasks = active_board.task.all()
        else:
            # get only the tasks associated with active category
            tasks = active_board.task.filter(category=active_category_id)

    planned = tasks.filter(status="Planned")
    in_progress = tasks.filter(status="In Progress")
    testing = tasks.filter(status="Testing")
    completed = tasks.filter(status="Completed")

    context = {
        "tasks": tasks,
        "planned": planned,
        "in_progress": in_progress,
        "testing": testing,
        "completed": completed,
        "boards": boards,
        "categories": categories,
        "highlighted_board": highlighted_board,
        "highlighted_category": highlighted_category,
    }

    return render(request, "dashboard/dashboard.html", context)


def new_board(request):
    form = BoardForm(initial={"created_by": request.user})

    if request.method == "POST":
        form = BoardForm(data=request.POST)
        if form.is_valid():
            form.save()
            return redirect("dashboard:home")

    context = {"form": form, "button": "Create"}
    return render(request, "dashboard/new_board.html", context)


def rename_board(request, pk):
    board = Board.objects.get(id=pk)
    form = BoardForm(instance=board)

    if request.method == "POST":
        form = BoardForm(request.POST, instance=board)
        if form.is_valid():
            form.save()
            return redirect("dashboard:home")

    context = {"form": form, "button": "Update"}
    return render(request, "dashboard/new_board.html", context)


def set_active_board(request):
    dashboard = Dashboard(request)

    if request.POST.get("action") == "post":
        board_id = int(request.POST.get("board_id"))
        dashboard.set_active_board_id(board_id=board_id)

        return JsonResponse({"message": "Active board set!"})


def set_active_category(request):
    dashboard = Dashboard(request)

    if request.POST.get("action") == "post":
        category_id = int(request.POST.get("category_id"))
        dashboard.set_active_category_id(category_id=category_id)

        return JsonResponse({"message": "Active category set!"})
