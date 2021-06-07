from .models import Board

class Dashboard():

    def __init__(self, request):
        self.session = request.session
        dashboard = self.session.get('dashboard')

        if 'dashboard' not in request.session:
            dashboard = self.session['dashboard'] = {}
        
        self.dashboard = dashboard
    
    def set_active_board_id(self, board_id):

        self.dashboard['active_board'] = board_id
        self.session.modified = True

    def active_board_check(self):
        if 'active_board' in self.dashboard:
            return True
        else:
            return False

    def get_active_board_id(self):
        return self.dashboard.get('active_board')
