from django.core import serializers


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
    def __init__(self, active_board, request):
        self.active_board = active_board
        self.request = request
    
    # returns needed data for refreshing the sidebar categories
    def categories_reload_json_response(self):

        categories = self.active_board.category.all()
        total_tasks_per_category = [len(category.task.filter(board=self.active_board)) for category in categories]
        total_tasks = self.active_board.task.all().count()
        categories = serializers.serialize("json", self.active_board.category.all()) 

        response = {
            'categories': categories,
            'total_tasks': total_tasks,
            'total_tasks_per_category': total_tasks_per_category,
        }

        return response
    
    # returns needed data for refreshing the sidebar boards
    def boards_reload_json_response(self):

        user = self.request.user
        total_boards = user.board.all().count()
        boards = serializers.serialize('json', user.board.all())
        response = {
            'total_boards': total_boards,
            'boards': boards
        }
        return response
