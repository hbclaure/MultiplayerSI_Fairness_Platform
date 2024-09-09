# import random
from game_files.agents.uncooperative import Uncooperative
from game_files.agents.pace_setting import Pace

import time


class UnfairSupportHumanLate(Pace):
    def __init__(self):
        super().__init__()
        self.support = 1
        self.start_time = time.time()
        self.last_check_time = self.start_time
        self.changed_sides = False
        self.timer_duration = 120  # Set the duration of the timer in seconds

    def run_ai(self, state):
        s = state
        enemies_left_positions = s['enemies_left_positions']
        enemies_left_shot = s['enemies_left_shot']
        enemies_right_positions = s['enemies_right_positions']
        ai_score = s['ai_score']
        timer = s['timer']

        num_left_enemies = len(enemies_left_positions)
        num_right_enemies = len(enemies_right_positions)
        ai_ship_enemies_destroyed = 0

        current_time = time.time()
        elapsed_time = current_time - self.start_time
        remaining_time = timer-elapsed_time


        if timer <= 0:
            # Timer has expired
            return False


        # print(f"Time remaining: {minutes:02d}:{seconds:02d}")

        # if ai_score == 0:
        #     self.support = 2

        elif elapsed_time >= self.timer_duration / 2:
            print('Over halfway point')
            # If more than half way, just help human
            self.support = 1
        else:
            # Switch sides every 5 enemies destroyed
            print('here256')
            if ai_score % 100 == 0 and not self.changed_sides:
                if self.support == 1:
                    self.support = 2
                else:
                    self.support = 1

                self.changed_sides = True

        # Reset the changed_sides flag if the condition is not met
        if ai_score % 100 != 0:
            self.changed_sides = False

        return True
