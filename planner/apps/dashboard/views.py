from django.shortcuts import render, redirect
from planner.apps.task.models import Task, Subtask
from .forms import SubtaskForm, TaskForm
from django.forms import fields, inlineformset_factory


def dashboard(request):
    tasks = Task.objects.all()
    subtasks = Subtask.objects.all()

    planned = tasks.filter(status="Planned")
    in_progress = tasks.filter(status="In Progress")
    testing = tasks.filter(status="Testing")
    completed = tasks.filter(status="Completed")

    total_tasks = tasks.count()
    total_planned = planned.count()
    total_inprogress = in_progress.count()
    total_testing = testing.count()
    total_completed = completed.count()

    context = {
        "planned": planned,
        "in_progress": in_progress,
        "testing": testing,
        "completed": completed,
        "subtasks": subtasks,
        "total_tasks": total_tasks,
        "total_planned": total_planned,
        "total_inprogress": total_inprogress,
        "total_testing": total_testing,
        "total_completed": total_completed,
    }

    return render(request, "dashboard/dashboard.html", context)


def add_task(request):
    task = Task()
    task_form = TaskForm(instance=task, initial={'created_by': request.user})

    SubtaskInlineFormSet = inlineformset_factory(Task, Subtask, form=SubtaskForm, extra=0)
    formset = SubtaskInlineFormSet(instance=task)
    
    if request.method == 'POST':
        task_form = TaskForm(request.POST)
        if task_form.is_valid():
            created_task = task_form.save(commit=False)
            formset = SubtaskInlineFormSet(request.POST, instance=created_task)
            
            if formset.is_valid():
                created_task.save()
                formset.save()
                return redirect('dashboard:home')

    context = {'task_form': task_form, "formset": formset, "button_value": "Add"}
    return render(request, "dashboard/task/add_task.html", context)


def update_task(request, pk):
    task = Task.objects.get(id=pk)
    task_form = TaskForm(instance=task)

    SubtaskInlineFormSet = inlineformset_factory(Task, Subtask, form=SubtaskForm, extra=0)
    formset = SubtaskInlineFormSet(instance=task)
    
    if request.method == 'POST':
        task_form = TaskForm(request.POST, instance=task)
        if task_form.is_valid():
            created_task = task_form.save(commit=False)
            formset = SubtaskInlineFormSet(request.POST, instance=created_task)
            
            if formset.is_valid():
                created_task.save()
                formset.save()
                return redirect('dashboard:home')

    context = {'task_form': task_form, "formset": formset, "button_value": "Add"}
    return render(request, "dashboard/task/add_task.html", context)


def delete_task(request, pk):
    task = Task.objects.get(id=pk)

    if request.method == "POST":
        task.delete()
        return redirect("dashboard:home")

    context = {"task": task}
    return render(request, "dashboard/task/delete_task.html", context)


def test(request):
    return render(request, 'dashboard/test.html')