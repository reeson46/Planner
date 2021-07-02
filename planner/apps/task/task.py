from django.core import serializers

class Task():

    def getCompletedSubtasks(self, tasks):

        result = [task.subtask.filter(is_complete=True).count() for task in tasks ]
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

  
        # planned = serializers.serialize('json', tasks_.filter(status="Planned"))
        # in_progress = serializers.serialize('json', tasks_.filter(status="In Progress"))
        # testing = serializers.serialize('json', tasks_.filter(status="Testing"))
        # completed = serializers.serialize('json', tasks_.filter(status="Completed"))
     

        #completed_subtasks = [{'task_id': task.id, 'completed_subs': task.subtask.filter(is_complete=True).count()} for task in tasks_ ]


        tasks = [{'task': serializers.serialize('json', [task]), 'created_by': serializers.serialize('json', [task.created_by], fields=['user_name']),'subtasks': serializers.serialize('json', task.subtask.all())} for task in tasks_]

        #tasks = serializers.serialize('json', tasks_)
        response = {
            'tasks': tasks,
            #'completed_subtasks': completed_subtasks
            # 'planned': planned,
            # 'in_progress': in_progress,
            # 'testing': testing,
            # 'completed': completed
        }

        return response