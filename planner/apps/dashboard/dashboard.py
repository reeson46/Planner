from planner.apps.account.account import Account
from .serializers import BoardSerializer, CategorySerializer


class Dashboard:
    def __init__(self, request):
        self.session = request.session
        dashboard = self.session.get("dashboard")

        if "dashboard" not in request.session:
            dashboard = self.session["dashboard"] = {}

        self.dashboard = dashboard
    
    """
    SESSION
    """
    def session_check(self):
        if self.dashboard:
            return True
        else:
            return False

    """
    BOARD
    """
    def add_all_boards(self, boards):
        for board in boards:
            board_ = str(board.id)
            self.dashboard[board_] = {}
        
        self.session.modified = True

    def add_board(self, board_id):
        board = str(board_id)

        self.dashboard[board] = {}
        self.session.modified = True

    def remove_board(self, board_id):
        board = str(board_id)

        del self.dashboard[board]
        self.session.modified = True
        
    def set_active_board_id(self, board_id):
        board = str(board_id)

        for k, v in self.dashboard.items():
            if k == board:
                v['active'] = True
            else:
                v['active'] = False

        self.session.modified = True
            
    def get_active_board_id(self):
        for k, v in self.dashboard.items():
            if v['active']:
                return k

    """
    CATEGORY
    """
    def set_active_category_id(self, board_id,  category_id):
        board = str(board_id)

        self.dashboard[board]['category'] = category_id
        self.session.modified = True
        

    def get_active_category_id(self, board_id):
        board = str(board_id)

        if 'category' not in self.dashboard[board]:  
            self.dashboard[board]['category'] = -1      
            self.session.modified = True
            return -1
        else:
           return self.dashboard[board]['category']


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

        account = Account(request)
        user = account.getUser()

        total_boards = user.board.all().count()
        boards = user.board.all()

        serialize = BoardSerializer(boards, many=True)

        response = {"total_boards": total_boards, "boards": serialize.data}

        return response
