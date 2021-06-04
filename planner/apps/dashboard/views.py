from django.shortcuts import render

from planner.apps.task.models import Subtask, Task


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
    }

    return render(request, "dashboard/dashboard.html", context)


# def add_task(request):
#     task = Task()
#     task_form = TaskForm(instance=task, initial={"created_by": request.user})

#     SubtaskInlineFormSet = inlineformset_factory(
#         Task, Subtask, form=SubtaskForm, extra=0
#     )
#     formset = SubtaskInlineFormSet(instance=task)

#     if request.method == "POST":
#         task_form = TaskForm(request.POST)
#         if task_form.is_valid():
#             created_task = task_form.save(commit=False)
#             formset = SubtaskInlineFormSet(request.POST, instance=created_task)

#             if formset.is_valid():
#                 created_task.save()
#                 formset.save()
#                 return redirect("dashboard:home")

#     context = {"task_form": task_form, "formset": formset, "button_value": "Add"}
#     return render(request, "dashboard/task/add_task.html", context)


# def update_task(request, pk):
#     task = Task.objects.get(id=pk)

#     task_form = TaskForm(instance=task)

#     SubtaskInlineFormSet = inlineformset_factory(
#         Task, Subtask, form=SubtaskForm, extra=0, can_delete=False
#     )
#     formset = SubtaskInlineFormSet(instance=task)

#     if request.method == "POST":
#         task_form = TaskForm(request.POST, instance=task)
#         if task_form.is_valid():
#             created_task = task_form.save(commit=False)
#             formset = SubtaskInlineFormSet(request.POST, instance=created_task)

#             if formset.is_valid():
#                 created_task.save()
#                 formset.save()
#                 return redirect("dashboard:home")

#     context = {
#         "task_form": task_form,
#         "formset": formset,
#         "button_value": "Update",
#     }
#     return render(request, "dashboard/task/add_task.html", context)


# def delete_task(request, pk):
#     task = Task.objects.get(id=pk)

#     if request.method == "POST":
#         task.delete()
#         return redirect("dashboard:home")

#     context = {"task": task}
#     return render(request, "dashboard/task/delete_task.html", context)


# def delete_subtask(request):

#     if request.POST.get("action") == 'post':
#         sub_id = request.POST.get('subtask_id')
#         subtask = Subtask.objects.get(pk=sub_id)
#         task_id = subtask.task.id
#         subtask.delete()
#         latest_sub = Subtask.objects.order_by('-id')[0]
#         import ipdb; ipdb.set_trace()
#         latest_sub_id = latest_sub.id


#         return JsonResponse({'task_id': task_id, 'latest_sub_id': latest_sub_id, 'message': 'deleted'})
