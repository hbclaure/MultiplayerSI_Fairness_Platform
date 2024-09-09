import time
import random

class Uncooperative:
    def __init__(self):
        # self.min_x = 425
        self.min_x = 0
        self.strategy = self.active
        
        self.CANVAS = 800 # width of canvas
        self.MIDDLE = 400 # middle of x axis
        self.SHOOTING_RANGE = 24 # hit enemy if within range
        self.HIT_RANGE = 35 # range for dodging bullets
        self.SECOND_HIT_RANGE = 50 # range check for moving towards enemies

        self.SHIP_Y = 540 # y value of ai_ship
        self.VERTICAL_BUFFER = 440 # vertical buffer for bullets (higher numbers means closer to ship)

        self.AI_RELATIVE_SPEED = 0.6 # relatively how much shorter time between bullets is for ai_agent
        self.FREQUENCY_BOUND = 1000 # ai max time between shots
        self.AI_FREQ = 1300

        self.attack_left = False

        self.start_support = random.randint(1,2)
        self.support = 1
        self.support_changed = False
        self.ai_shoots = False

    def update(self, state):
        return self.strategy(state)

    def run_ai(self, state):
        """ Check whether ship should target left (human player's) enemies """
        return False

    def active(self, state):
        s = state

        ship_x = s['ai_position']
        ship_y = self.SHIP_Y

        enemies_left_positions = s['enemies_left_positions']
        enemies_left_shot = s['enemies_left_shot']
        enemies_right_positions = s['enemies_right_positions']
        enemies_right_shot = s['enemies_right_shot']

        bullets_left_positions = s['bullets_left_positions']
        bullets_right_positions = s['bullets_right_positions']
        game_time = s['timer']

        self.ai_shoots = s['can_shoot']

        ai_last_shot = s['ai_last_shot_time']

        # player_avg_frequency = self.FREQUENCY_BOUND
        # if s['player_avg_frequency']:
        #     player_avg_frequency = min(self.FREQUENCY_BOUND, int(s['player_avg_frequency']))

        num_left_enemies = len(enemies_left_positions)
        num_right_enemies = len(enemies_right_positions)


        self.attack_left = self.run_ai(state)


        left = False
        right = False
        shoot = False
        hit = False

      

      

        # find bullet that should determine movement
        nearest_bullet = [0,0]

        if ship_x >= self.MIDDLE:
            bullets_to_search = bullets_right_positions
        else:
            bullets_to_search = bullets_left_positions
        
        if ship_x >= self.MIDDLE - 25 and ship_x <= self.MIDDLE +25:
            bullets_to_search = bullets_left_positions + bullets_right_positions

        problem_bullets = []
        x_diff_prev = self.CANVAS

        for bullet in bullets_to_search:
            x_diff = abs(bullet[0] - ship_x)
            if bullet[1] < self.SHIP_Y and bullet[1] > self.VERTICAL_BUFFER and x_diff < self.HIT_RANGE * 2:
                problem_bullets.append(bullet)
                if x_diff < x_diff_prev:
                    nearest_bullet = bullet
                    x_diff_prev = x_diff

        # find nearest enemy by Y
        nearest_enemy = [0,0]
        nearest_x_diff = self.CANVAS
        nearest_y_diff = 100000
        closest_x_diff = self.CANVAS

        # if self.attack_left:
        #     enemies_to_search = enemies_left_positions
        # else:
        #     enemies_to_search = enemies_right_positions

        if self.support == 1:
            enemies_to_search = enemies_left_positions
            enemies_to_search_shot = enemies_left_shot
        else:
            enemies_to_search = enemies_right_positions
            enemies_to_search_shot = enemies_right_shot

        for enemy in enemies_to_search:
            check_distance_x = abs(enemy[0] - ship_x)
            check_distance_y = abs(enemy[1] - ship_y)
            index = enemies_to_search.index(enemy)
            if check_distance_y < nearest_y_diff and enemies_to_search_shot[index] == False:
                nearest_enemy = enemy
                nearest_x_diff = check_distance_x
                nearest_y_diff = check_distance_y
            elif check_distance_y == nearest_y_diff and check_distance_x < nearest_x_diff and enemies_to_search_shot[index] == False:
                nearest_enemy = enemy
                nearest_x_diff = check_distance_x
                nearest_y_diff = check_distance_y
            elif check_distance_y < (nearest_y_diff+50) and check_distance_x < closest_x_diff and enemies_to_search_shot[index] == False:
                closest_x_diff = check_distance_x

        # set restriction on AI Frequency 
        if round(time.time() * 1000) - ai_last_shot < self.AI_FREQ:
            self.ai_shoots = False


        # if round(time.time() * 1000) - ai_last_shot < player_avg_frequency * self.AI_RELATIVE_SPEED:
        #     self.ai_shoots = False 

        # check if ai_agent is in danger of being hit by bullet
        if nearest_bullet[0] <= ship_x + self.HIT_RANGE and nearest_bullet[0] >= ship_x - self.HIT_RANGE:
            hit = True

        approached_enemy = False
        

        if not(self.ai_shoots):
            # if can't shoot, figure out which way to move
            if hit:
                if nearest_bullet[0] >= self.CANVAS-75:
                    left = True
                elif nearest_bullet[0] <= self.min_x + 55:
                    right = True
                elif nearest_bullet[0] > ship_x:
                    left = True
                elif nearest_bullet[0] <= ship_x:
                    right = True
        else:
            #IF AI CAN SHOOT
            if nearest_x_diff <= self.SHOOTING_RANGE:
                shoot = True

            if nearest_enemy[0] < ship_x:
                if not(nearest_bullet[0] < ship_x and self.SHIP_Y - nearest_bullet[1] < 200 and ship_x - nearest_bullet[0] <= self.SECOND_HIT_RANGE):
                    left = True
                    approached_enemy = True
            elif nearest_enemy[0] > ship_x:
                if not(nearest_bullet[0] > ship_x and self.SHIP_Y - nearest_bullet[1] < 200 and nearest_bullet[0] - ship_x <= self.SECOND_HIT_RANGE):
                    right = True
                    approached_enemy = True
                    
            if not approached_enemy and hit:
                if x_diff_prev >5:
                    # if not going to hit bullet, don't shoot so you can move
                    shoot = False
                # figure out which way to move so you don't get hit
                if nearest_bullet[0] >= self.CANVAS-75:
                    left = True
                elif nearest_bullet[0] <= self.min_x + 55:
                    right = True
                elif nearest_bullet[0] > ship_x:
                    left = True
                elif nearest_bullet[0] <= ship_x:
                    right = True

        # if no more enemies to worry about, do nothing
        if num_right_enemies==0 and not(self.attack_left):
            left = False
            right = False
        #print('l,r,s,su',left,right,shoot,self.support)
        # pass back action
        action = {
            'left': left,
            'right': right,
            'shoot': shoot,
            'support': self.support
        }
        return action