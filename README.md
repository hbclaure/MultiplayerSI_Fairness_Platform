Multi-Agent Space Invaders (Web Version)
----------------------------------------

Space invaders game built in javascript, HTML 5, and [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) using [Tornado](https://www.tornadoweb.org/en/stable/) and [Phaser 3](https://phaser.io/phaser3). 


## Install

Follow the instructions in [docs/install_osx.md](docs/install_osx.md) to install dependencies in OSX.

## Start the game

```bash
pipenv run python space_invaders/websocket.py
```

## Code Organization

The code is organized as follows:

```text
space_invaders_web/
|   README.md
|-- docs/
    |   install_osx.md          # installation instructions
|-- space_invaders/             # main code
    |   websocket.py            # tornado application
    |-- db/                     # database files
        |   create_databse.sql  # how to create the database
        |   game_logs.db        # sqlite3 database of game logs
    |-- static/					# static files for flask
    	|	assets/				# images, sounds, and fonts for game
    	|	favicon.ico         # favicon for website
    	|   js/					# javascript code
    |-- templates/              # templates for rendering website
        |   index.html          # main website
```

## NGINX notes 

sudo ln -sf /home/si_app/implicit_feedback_si/nginx_config/nginx.conf /etc/nginx/sites-enabled/space_invaders

sudo service nginx restart
sudo service nginx status

sudo ln -sf /home/si_app/implicit_feedback_si/nginx_config/space_invaders.service /etc/systemd/system/space_invaders.service

## Local Webpage
Launch Webpage
```bash
cd error_recovery_si_nao/local_webpage
python3 -m http.server <port number>
rosrun error_recovery_si_nao localwebpage.py
```

Launch Game
```bash
source ../../devel/setup.bash
source venv_game/bin/activate
rosrun error_recovery_si_nao websocket.py
```

Launch Robot controls

Launch Webcam check
```bash
python3 webcam_check/webcam_check.py
```



///
Topics:
/audio/audio /audio/audio_info /body_tracking_data /rgb/camera_info /rgb/image_raw/compressed /space_invaders/game/game_condition /space_invaders/game/game_mode /space_invaders/game/game_state /space_invaders/game/nao_action /space_invaders/game/robot_action /tf /tf_static



roslaunch audio_play play.launch
rosrun image_view image_view image:=/rgb/image_raw _image_transport:=compressed


## Analyze Results

Question 1 - Instantaneous Fairness
Check if early late or late early
"Nao's support towards me was fair." (1- Strongly Disagree. 5- Strongly Agree.)


Question 2 - Harm
“Nao's gameplay strategy significantly reduced my chances of success"? (1- Strongly Disagree. 5- Strongly Agree.)


Question 3- Support Distribution
"Nao has provided significantly more help to Shutter than to me". (1- Strongly Disagree. 5- Strongly Agree.)


Question 4- Conduct
 "How strongly do you feel that the robot had feasible alternatives to its actions in this part of the game?".(1- Not at All. 5- Very Strongly.)

Question 5-  Moral Transgression
"How would you rate the social appropriateness of the robot's decisions in the context of the competition between yourself and Shutter? Here, 'social appropriateness' refers to how fitting or suitable the robot's actions are within this competitive context.". (1- Not at All. 5- Very Strongly.)

Survey

Question 1 - Overall Fairness
"Nao's support towards me was fair." (1- Strongly Disagree 5-Strongly Agree)


Question 2- IOS: Nao and Shutter
Which picture best describes Shutter's relationship with the Nao in this round? (1- Seperate. 7- Close)

Question 3 - IOS: Nao and Human
Which picture best describes Shutter's relationship with the Nao in this round?(1- Seperate. 7- Close)

Question 4- Reflecting on the recently completed round, please rate your perception of the relative support that Nao provided to you and Shutter. Choose the statement that best aligns with your experience. (1- Nao provided significantly less support to me than Shutter  5- Nao provided significantly more support to me than Shutter)









rosbag record /audio/audio /audio/audio_info /body_tracking_data /rgb/camera_info /rgb/image_raw/compressed /space_invaders/game/game_condition /space_invaders/game/game_mode /space_invaders/game/nao_action /space_invaders/game/robot_action /tf /tf_static -O pilot_ah.bag
