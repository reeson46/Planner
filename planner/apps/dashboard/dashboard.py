class Dashboard:
    def __init__(self, request):
        self.session = request.session
        dashboard = self.session.get("dashboard")

        if "dashboard" not in request.session:
            dashboard = self.session["dashboard"] = {}

        self.dashboard = dashboard

    ###
    # Active board
    ###
    def set_active_board_id(self, board_id):

        self.dashboard["active_board"] = board_id
        self.session.modified = True

    def active_board_check(self):
        if "active_board" in self.dashboard:
            return True
        else:
            return False

    def get_active_board_id(self):
        return self.dashboard.get("active_board")

    ###
    # Active category
    ###
    def set_active_category_id(self, category_id):

        self.dashboard["active_category"] = category_id
        self.session.modified = True

    def active_category_check(self):
        if "active_category" in self.dashboard:
            return True
        else:
            return False

    def get_active_category_id(self):
        return self.dashboard.get("active_category")


class Sidebar:
    def __init__(self, active_board):
        self.active_board = active_board
    
    # this functions returns needed data for refreshing the sidebar categories
    def categories_reload_json_response(self):
        self.categories = self.active_board.category.all()
        self.total_tasks = len(self.active_board.task.all())
        self.category_names = [category.name for category in self.categories]
        self.category_ids = [category.id for category in self.categories]
        self.total_tasks_per_category = [len(category.task.filter(board=self.active_board)) for category in self.categories]

        response = {
            'total_tasks': self.total_tasks,
            'category_names': self.category_names,
            'category_ids': self.category_ids,
            'total_tasks_per_category': self.total_tasks_per_category,
        }

        return response