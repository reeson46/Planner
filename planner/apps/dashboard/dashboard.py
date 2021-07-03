from .serializers import BoardSerializer, CategorySerializer

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

    # returns needed data for refreshing the sidebar categories
    def categories_reload_json_response(self, active_board):

        categories = active_board.category.all()
        total_tasks_per_category = [
            category.task.filter(board=active_board).count() for category in categories
        ]
        total_tasks = active_board.task.all().count()

        serialize = CategorySerializer(categories, many=True)

        response = {
            "categories": serialize.data,
            "total_tasks": total_tasks,
            "total_tasks_per_category": total_tasks_per_category,
        }

        return response

    # returns needed data for refreshing the sidebar boards
    def boards_reload_json_response(self, request):

        user = request.user
        total_boards = user.board.all().count()
        boards = user.board.all()

        serialize = BoardSerializer(boards, many=True)

        response = {"total_boards": total_boards, "boards": serialize.data}
        
        return response
