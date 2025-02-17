from game_files.agents.uncooperative import Uncooperative

class CooperativeLate(Uncooperative):
    def __init__(self):
        super().__init__()
        self.min_x = 0
        
    def check_attack_left(self, state):
        s = state
        enemies_left_positions = s['enemies_left_positions']
        enemies_right_positions = s['enemies_right_positions']
        num_left_enemies = len(enemies_left_positions)
        num_right_enemies = len(enemies_right_positions)

        print('state',s)
        print('number of enemies left', enemies_left_positions)



        attack_left = num_right_enemies == 0
        return attack_left