from .serializers import TaskSerializer


class Task:
    def getCompletedSubtasks(self, tasks):

        result = [task.subtask.filter(is_complete=True).count() for task in tasks]
        return result

    def getTaskIds(self, tasks):

        result = [task.id for task in tasks]
        return result

    def getTasks(self, category_id, active_board):

        if category_id == -1:

            tasks = active_board.task.all()
        else:

            tasks = active_board.task.filter(category=category_id)

        return tasks

    def tasks_reload_json_response(self, active_category_id, active_board):

        if active_category_id == -1:

            tasks_ = active_board.task.all()
        else:

            tasks_ = active_board.task.filter(category=active_category_id)

        serializer = TaskSerializer(instance=tasks_, many=True)

        response = {
            "tasks": serializer.data,
        }

        return response
