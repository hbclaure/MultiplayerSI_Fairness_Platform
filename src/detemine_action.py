#!/usr/bin/env python

# ros imports
import rospy
from std_msgs.msg import String

# other imports
import json

WE_CONDITIONS = ['A','C']
I_CONDITIONS = ['B','D']

BEFORE_CONDITIONS = ['A','B']
AFTER_CONDITIONS = ['C','D']

GAME_ENEMIES = 9*4*3*2 # across * row per color * color * sides
MIDDLE = 600 # middle of x axis

class DetermineAction():
    '''
    ROS node
    '''
    def __init__(self):
        # Initialize the node
        print("initializing determine robot action node")
        rospy.init_node('determine_robot_action')
        
        # Subscribers
        rospy.Subscriber('space_invaders/game/game_state', String, self.determine_action_cb)
        rospy.Subscriber('space_invaders/game/game_condition', String, self.game_condition_cb)
        rospy.Subscriber('space_invaders/game/game_mode', String, self.game_mode_cb)

        # Publishers 
        self.robot_action_pub = rospy.Publisher('space_invaders/game/robot_action',String,queue_size=5)

        # Attributes
        self.game_condition = None
        self.asked_feedback = False
        self.said_strategy = False
        self.condition_met = False
        self.midway_action = False
        self.end_action = False
        self.changing_support_action = True
        self.nao_only_intro= False
        self.completed_congratulations = False
        self.game_mode = None

    def game_mode_cb(self,msg):
        self.game_mode = int(msg.data)
    
    def determine_action_cb(self,game_state):
        try:
            if self.game_mode == 0:
                #Nao Training Session
                game_state_dict = json.loads(game_state.data)
                #print('This is game mode', game_state_dict)
                #if 'enemies_left_positions' in game_state_dict.keys():
                #    robot_action = self.action_from_game_state(game_state_dict)
                #    self.robot_action_pub.publish(robot_action)
                #    self.robot_action_pub.publish(robot_action)
                robot_action = self.action_from_game_state_nao_only(game_state_dict)
                self.robot_action_pub.publish(robot_action)

                #Add practice robot Behaviors

            elif self.game_mode == 1:
                #Shutter and player only- noactiion from Nao
                pass
                

            else:
                game_state_dict = json.loads(game_state.data)
                #print('This is game mode', game_state_dict)
                #if 'enemies_left_positions' in game_state_dict.keys():
                #    robot_action = self.action_from_game_state(game_state_dict)
                #    self.robot_action_pub.publish(robot_action)
                #    self.robot_action_pub.publish(robot_action)
                robot_action = self.action_from_game_state(game_state_dict)
                self.robot_action_pub.publish(robot_action)

                #Add practice robot Behaviors
        except ValueError:
            print(game_state)


    def game_condition_cb(self,msg):
        self.game_condition = msg.data
        self.asked_feedback = False
        self.said_strategy = False
        self.condition_met = False
        self.midway_action = False
        self.end_action = False

    def run(self):
        pass

    def action_from_game_state_nao_only(self, game_state):
        if self.nao_only_intro == False:
            robot_action = 'introduce_nao_skills'
            self.nao_only_intro = True
            return robot_action

    def action_from_game_state(self,game_state):
        try:
            enemies_left_positions = game_state['enemies_left_positions']

            enemies_right_positions = game_state['enemies_right_positions']
            num_left_enemies = len(enemies_left_positions)
            num_right_enemies = len(enemies_right_positions)

            player1_score = game_state['player1_score']
            player2_score = game_state['player2_score']
            timer = game_state['timer']


            total_enemies = num_left_enemies+num_right_enemies

            support = game_state['ai_actual_action']['support']

            #if game is over look at the player who won
            # print('time',timer)
            # if timer == 0 and player1_score > player2_score and not self.completed_congratulations:
            #     robot_action = 'congratulate_player1'
            #     self.completed_congratulations = True
            #     print('congratulate player 1')

            #     return robot_action

            # elif timer == 0 and player2_score > player1_score and not self.completed_congratulations:
            #     robot_action = 'congratulate_player2'
            #     self.completed_congratulations = True
            #     print('congratulate player 2')
            #     return robot_action

            # elif timer == 0 and player2_score == player1_score and not self.completed_congratulations:
            #     robot_action = 'tied_game'
            #     self.completed_congratulations = True
            #     print('tied game')
            #     return robot_action

            #         # Else look at the player who its supporting during change
            # elif support == 1 and self.changing_support_action == False: 
                
            #     robot_action = 'look_at_support_player_right'
            #     self.changing_support_action = True
            #     print('support right')
            #     return robot_action

            # elif support ==2 and self.changing_support_action == True:
            
            #     robot_action = 'look_at_support_player_left'
            #     self.changing_support_action = False
            #     print('support left')
            #     return robot_action


            timer = game_state['timer']
            support = game_state['ai_actual_action']['support']
            player1_score = game_state['player1_score']
            player2_score = game_state['player2_score']


            if timer == 0:
                return self.congratulate_winner(player1_score, player2_score)
            else:
                return self.perform_support_action(support)
        except:
            print("events" in game_state.keys())


    def congratulate_winner(self, player1_score, player2_score):


        """Determines which player to congratulate based on their scores."""
        # if not self.completed_congratulations:
        #     self.completed_congratulations = True

        if player1_score > player2_score:
            #print('congratulate human')
            robot_action = 'congratulate_player1'
            return robot_action
        elif player1_score < player2_score:
            #print('congratulate shutter')
            robot_action = 'congratulate_player2'

            return robot_action
        
    
    def perform_support_action(self, support):
        """Determines the support action to perform based on the current support status."""
        if support == 1 and not self.changing_support_action:
            self.changing_support_action = True
            #print('supporting Human')
           
            return 'look_at_support_player_left'
        elif support == 2 and self.changing_support_action:
            #print('supporting shutter')
            self.changing_support_action = False
            return 'look_at_support_player_right' 

 

        


        #to include add elif uncomment else at bottom

        #if countdown_timer ==  120  and not(self.midway_action):
        #    robot_action = "midway_comment"
        #    self.midway_action = True
            
        #    return robot_action

        
        #if countdown_timer ==  10  and not(self.end_action):
        #    robot_action = "end_comment"
        #    self.end_action = True
            
        #    return robot_action           

 



        # if not(self.said_strategy) and total_enemies < GAME_ENEMIES*.75 and game_state['ai_position']<MIDDLE*.75:
        #         robot_action = "highlight_change"
        #         print("HIGHLIGHT")
        #         print(self.said_strategy)
        #         self.said_strategy = True
        #         print(self.said_strategy)
        #         return robot_action

        # if self.game_condition in BEFORE_CONDITIONS and not(self.asked_feedback):
        #     # asking for feedback before crossing to help
        #     if total_enemies < GAME_ENEMIES*.875:
        #         robot_action = "ask_for_feedback"
        #         self.asked_feedback = True
        #         print("Ask for feedback: ", self.game_condition)
        #         return robot_action
        # elif self.game_condition in AFTER_CONDITIONS and not(self.asked_feedback): 
        #     # after for feedback after crossing to help
        #     if total_enemies <= GAME_ENEMIES*.65 and game_state["ai_position"] > MIDDLE*1.1:
        #         robot_action = "ask_for_feedback"
        #         self.asked_feedback = True
        #         print("Ask for feedback: ", self.game_condition)
        #         return robot_action
        #else:
        #    return ""
        

if __name__ == '__main__':
    
    try:
        determine_action = DetermineAction()
        rospy.spin()

    except rospy.ROSInterruptException:
        pass