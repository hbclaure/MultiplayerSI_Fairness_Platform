import time
from game_files.agents.uncooperative import Uncooperative
from game_files.agents.pace_setting import Pace

class UnfairSupportHumanEarly(Pace):
    def __init__(self):
        super().__init__()
        self.support = 1
        self.start_time = time.time()
        self.changed_sides = False
        self.timer_duration = 120  # Set the duration of the timer in seconds

    def run_ai(self, state):
        s = state
        ai_score = s['ai_score']
        timer = s['timer']

        current_time = time.time()
        elapsed_time = current_time - self.start_time
        remaining_time = timer-elapsed_time
        if timer <= 0:
            # Timer has expired
            return False

        if elapsed_time <= self.timer_duration / 2:
            # If less than half way, help human
            print('Only help human for half')
            self.support = 1

        else:
            print('alternate')


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