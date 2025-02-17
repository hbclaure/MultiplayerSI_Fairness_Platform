/**
All the helper functions and global variables for space invaders
**/

var SHIP_BULLET_SPEED = 350

var ai_messages = {
    1: "Sorry!",
    2: "Sorry!",
    7: "Haha sorry! \n I'm so silly!",
    5: "I’m sorry!\nThanks for the heads up!",
    6: "Sorry, my mistake!",
    8: "Sorry, \nit was the system's fault",
    4: "Sorry"
}

var alternate_messages = {
    7: "Silly me!"
}
var total_score = 0;

// set image width; height will be matched accordingly

SHIP_BULLET_SPEED = 350


// The different game modes
const PRACTICE = 0;
const COOPERATIVE_EARLY = 1;
const COOPERATIVE_LATE = 2;
const UNCOOPERATIVE = 3;

const static_url = '';

var mode;                               //!< game mode
var ai_supporting = 0;
var cursors;                            //!< keyboard access
var space_key;                          //!< space key
var enter_key;                          //!< enter key
var keyA;
var keyS;
var keyD;
var keyW;
var keyG;
var keyF;
var p1xBoxLeft;
var p1xBoxDown;
var p1xBoxRight;
var p1xBoxUp;
var p1xBoxA;
var p1xBoxY;
var p2xBoxLeft;
var p2xBoxDown;
var p2xBoxRight;
var p2xBoxUp;
var p2xBoxA;
var p2xBoxY;
var p1_connected = false;
var p2_connected = false;
var p1_connected_text;
var p2_connected_text;
var gamepad1;
var gamepad2;
var player_ship;                        //!< player_ship
var player_ship2;
var players = [];
var ai_ship;                            //!< ai_ship
var enemies_left;                       //!< enemies
var timer = 240;
var time;
var respawn_timer = 7000;
var repeat_mult_5 = false;
var enemies_right;
var enemies_middle;
var enemies_practice;
var debug_text;
var game_log = [];                      //!< a log of all the information from this game
var events;
var frames;                             //!< the frames of this game
var frames_not_sent;
var frame_number = 0;                       //!< the number of the current frame
var last_frame;                         //
var previous_shots_time = [];                //!< the times of the last 5 shots the player fired
var rounds_played = 0;                  //!< number of rounds that they have played
var player_score;                       //!< total player score (accumulated over multiple rounds)
var ai_score;                           //!< total ai score (accumulated over multiple rounds)
var icon;
var date;                               //!< date
var player_id;                          //!< unique ID
var game_num;                           //!< game number
var display_vid;
var game_condition;
var max_player_frequency = 400;
var max_ai_frequency = 0;

var frames_per_message = 100;

var enemy_shoot_timer_level = 6;
var timer_interval;
var num_enemies_shot = 0;
var ai_over;
var player_over;
var timer_interval;
var num_enemies_shot = 0;



/**
Function to find the game id and game mode (which are passed as GET parameters)
Modified from code found at: https://stackoverflow.com/questions/5448545/how-to-retrieve-get-parameters-from-javascript
**/
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = tmp[1];
    }
    return result;
}

player_id = findGetParameter('id') ? findGetParameter('id') : 'UNDEFINED';
mode = findGetParameter('mode'); 
mode = (mode && !isNaN(mode) && parseInt(mode, 10) >= 0 && parseInt(mode, 10) <= 7) ? parseInt(mode, 10) : COOPERATIVE_EARLY;
game_num = findGetParameter('game') ? findGetParameter('game') : 0;
game_condition = findGetParameter('condition') ? findGetParameter('condition') : 'C';
display_vid = findGetParameter('v') ? findGetParameter('v') :'off';

/**
 * Create bullets pool
 * @param {int} number number of bullets in the pool
 * @param {String} image_id image id for the bullets
 * @param {bool} increase_bbox increase the bullet bounding box by 3 times (makes it easier to detect collisions)
 */
function create_bullets_pool(number, image_id, increase_bbox=false) {
    bullets = this.physics.add.group({ // bullets pool. They become visible when a bullet is fired
        key: image_id,
        repeat: number,
        visible: false,
        active: false,
        collideWorldBounds: true,
    }); 
    // prevent the bullets from falling so that they don't kill one of the enemies by accident 
    // when they are created... 
    Phaser.Actions.Call(bullets.getChildren(), function(b) {
        b.body.setImmovable(true);
        b.body.setAllowGravity(false);
    });
    // increase bullet collision bounding box in case they are going down (makes the game a bit easier)
    if (increase_bbox) {
        Phaser.Actions.Call(bullets.getChildren(), function(b) {
            b.body.setSize(b.body.width*3 , b.body.height*0.5, true);
        });
    }
    return bullets
}

/**
 * Helper function to fire a bullet
 * @param {Phaser.GameObjects.GameObject} bullets_group bullets group (as output by create_bullets_pool())
 * @param {int} x horizontal coordinate for the bullet
 * @param {int} y vertical coordinate for the bullet
 * @param {int} direction -1 or 1 depending on whether we want the bullet to move up or down
 * @param {int} speed magnitude of the bullet velocity
 */
function fire_bullet(bullets_group, x, y, direction, speed = 500) {
    // Scans the group for the first member that has an Phaser.GameObjects.GameObject#active state set to false,
    // and assign position x and y
    var bullet = bullets_group.get(x, y);
    if (bullet) {
        // set bullet position and speed
        bullet.body.originX = 0.5;
        bullet.body.originY = 1.0;
        bullet.body.velocity.y = speed * direction;
        // make bullet visible
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.body.setImmovable(false);
        bullet.body.setAllowGravity(false);
        // setup callback to hide bullet when it reaches the end of the screen
        bullet.body.onWorldBounds = true;                    
        bullet.body.world.on('worldbounds', function(body) {
            if (body.gameObject == bullet) {
                bullet.setVisible(false);
                bullet.setActive(false);
                bullet.body.setImmovable(true);
                bullet.body.setAllowGravity(false);
            }
        })
    }
}

/**
 * Helper function to fire a bullet from a group of enemies
 * @param {Phaser.GameObjects.GameObject} enemies group of enemies
 * @param {Phaser.GameObjects.GameObject} bullets group of bullets that the enemies can fire
 */
function fire_enemy_bullet(enemies, bullets) {
    // find valid columns (those that still have enemies in)
    var num_valid = 0;
    var valid_columns = [];
    for (var i=0; i<enemies.num_columns; i++) {
        valid_columns.push(0);
    }
    var children = enemies.getChildren();
    for (var i = 0; i < children.length; i++) {
        col = children[i].grid_column;
        if ([valid_columns[col]] == 0) {
            valid_columns[col] = 1;
            num_valid += 1;
        }
        if (num_valid == enemies.num_columns) break;
    }
    enemies.num_valid_columns = num_valid;
    // turn valid_columns to indexes
    var valid_index = [];
    for (var i=0; i<valid_columns.length; i++) {
        if (valid_columns[i] == 1)
            valid_index.push(i);
    }
    // sample a colum
    var chosen_index = Math.floor(Math.random() * num_valid);
    var col = valid_index[chosen_index];
    // find lowest row with an enemy for the chosen column
    var enemy = null;
    for (var i = 0; i < children.length; i++) {
        if (children[i].grid_column == col && (enemy == null || enemy.grid_row < children[i].grid_row)) {
            enemy = children[i];
        }
    }
    // fire bullet for that enemy
    if (enemy != null && enemy.is_hit == false) {
        fire_bullet(bullets, enemy.body.x + enemy.body.width * 0.5, enemy.body.y + 50, 1, 100);
    }
}

/**
 * Create ship object
 * @param {string} image_id Image ID for the ship
 * @param {int} type type of ship (0 for human, 1 for AI)
 * @param {string} label label for game logs
 * @param {int} x horizontal coordinate for the ship (moves horizontally)
 * @param {int} y vertical coordinate for the ship (fixed)
 * @param {int} speed speed for the ship
 * @param {int} min_x minimum allowed horizontal position for the ship
 * @param {int} max_x maximum allowed horizontal position for the ship
 * @param {int} shooting_direction shooting direction (-1 means up, 1 means down)
 * @param {String} bullet_image_id image id for the bullet
 * @returns object with ship image, corresponding bullets group, and update function for handling actions
 */
function create_ship(num = 0, image_id="ship", label="PLAYER",type = 0, x = 200, y = 540, speed = 5, bullet_image_id = "laser", min_x = 0, message_height = 10) {
            
    var canvas_width = this.sys.canvas.width;
    var canvas_height = this.sys.canvas.height;
    var sprite = this.physics.add.sprite(x, y, image_id).setOrigin(0.5, 1.0); 
    sprite.body.setImmovable(true);
    sprite.body.setAllowGravity(false);
    sprite.body.setSize(sprite.width*0.8 , sprite.height, true);
    sprite.props = {} // add properties object to ship sprite
    sprite.props.speed = speed;
    sprite.props.dead = false;
    sprite.props.score = 0;
    var font_type = (image_id == 'ship' || image_id == 'ship2') ? 'PressStart2P_Purple' : (image_id == 'avery') ? 'PressStart2P_Orange' : 'PressStart2P_White';
    // sprite.props.scoreText = this.add.bitmapText(x, 3, font_type, 'SCORE 0', 20);
    // sprite.props.lives = 3;
    //sprite.props.scoreText = this.add.bitmapText(x+22, 3, font_type, 'SCORE 0', 18);
    sprite.props.lives = 100;  // Set lives to a large amount so it seems infinite
    sprite.props.image_id = image_id;
    sprite.props.invincible = false;
    sprite.props.invincibility_timer = 0;
    sprite.props.last_shot_frame = 0;
    sprite.props.last_shot_time = 0;
    sprite.props.shot_cooldown = 35;
    sprite.props.exploding = false;
    sprite.props.label = label;
    sprite.explote_anim = image_id + '_exp';

    //sprite.props.emote = this.add.circle(x, y, 5);
    //sprite.props.emote.setFillStyle(0xFFFFFF, 1.0);

    sprite.props.message = this.add.bitmapText(x, y+message_height, font_type, 'hello', 14);
    sprite.props.message.originX = 0.5;
    sprite.props.message.visible = false;

    // animation for the player/ai explosions
    var explosion = (image_id == 'ship' || image_id == 'ship2') ? 'shipexplosion' : (image_id == 'avery') ? 'averyexplosion' : 'jordanexplosion';


    if (!(this.anims.get(image_id + '_exp'))) { 
        this.anims.create({
            key: image_id + '_exp',
            frames: [{ key: explosion } ],
            frameRate: 10,
        });
    }
    

    
    sprite.lives = [] // add sprites to display lives
    // console.log(sprite.lives);
    // console.log("^ this should be empty");
    // var life_x = x - 200;
    // var life_x;
    // if (num == 1) {
    //     life_x = x - 200
    //     if (x > 400) {
    //         life_x = x - 22
    //     }
    // } else if (num == 2) {
    //     life_x = x
    //     if (x > 400) {
    //         life_x = x - 22
    //     }
    // }
    // var life_x = x - 200
    // if (x > 400) {
    //     life_x = x - 22
    // }
    // this.add.bitmapText(life_x, 3, font_type, 'LIVES', 20);
    // for (i = 0; i < sprite.props.lives; i++) {
    //     var life = this.physics.add.sprite(life_x + 125 + 25 * i, 25, image_id).setOrigin(0.5, 1.0);
    //     life.body.setImmovable(true);
    //     life.body.setAllowGravity(false);
    //     life.body.setSize(life.width * 0.4 , life.height * 0.5, true);
    //     life.setScale(0.5);
    //     sprite.lives.push(life);
    // }

    if (num == 1) {
        var life_x = 0 //x - (canvas_width / 4) - 200
        // if (x > 400) {
        //     life_x = x - (canvas_width / 4) - 22
        // }
        this.add.bitmapText(life_x, 3, font_type, '', 20);
        for (i = 0; i < sprite.props.lives; i++) {
             var life = this.physics.add.sprite(life_x + 125 + 25 * i, 25, image_id).setOrigin(0.5, 1.0);
            life.body.setImmovable(true);
            life.body.setAllowGravity(false);
            life.body.setSize(life.width * 0.4 , life.height * 0.5, true);
            life.setScale(0.5);
            life.setVisible(false); 
            sprite.lives.push(life);
        }
    } else if (num == 2) {
        var life_x = 0 // - 200
        // if (x > 400) {
        //     life_x = x - 22
        // }
        this.add.bitmapText(life_x, 30, font_type, '', 20);
        for (i = 0; i < sprite.props.lives; i++) {
             var life = this.physics.add.sprite(life_x + 125 + 25 * i, 50, image_id).setOrigin(0.5, 1.0);
            life.body.setImmovable(true);
            life.body.setAllowGravity(false);
            life.body.setSize(life.width * 0.4 , life.height * 0.5, true);
            life.setScale(0.5);
            life.setVisible(false); 
            sprite.lives.push(life);
        }
    } else {
        var life_x = x + 187
        // if (x > 400) {
        //     life_x = x - 22
        // }
        this.add.bitmapText(life_x, 30, font_type, '', 20);
        for (i = 0; i < sprite.props.lives; i++) {
             var life = this.physics.add.sprite(life_x + 125 + 25 * i, 50, image_id).setOrigin(0.5, 1.0);
            life.body.setImmovable(true);
            life.body.setAllowGravity(false);
            life.body.setSize(life.width * 0.4 , life.height * 0.5, true);
            life.setScale(0.5);
            life.setVisible(false); 
            sprite.lives.push(life);
        }
    }
    // for (i = 0; i < sprite.props.lives; i++) {
    //     console.log("for loop");
    //     var life = this.physics.add.sprite(life_x + 125 + 25 * i, 25, image_id).setOrigin(0.5, 1.0);
    //     life.body.setImmovable(true);
    //     life.body.setAllowGravity(false);
    //     life.body.setSize(life.width * 0.4 , life.height * 0.5, true);
    //     life.setScale(0.5);
    //     sprite.lives.push(life);
    // }

    var obj_width = sprite.displayWidth;     

    var bullets = this.create_bullets_pool(8, bullet_image_id);
    var sound = this.custom_sounds.fire_ship;


    return {
        sprite: sprite,                                         //!< image object for the ship
        bullets_group: bullets,                                 //!< bullets shot by the ship
        min_x: min_x,
        update(move_left, move_right, shoot, support)                    //!< update the ship state based on requested actions   
        {          
            // do nothing if the ship has been killed!
            if (this.sprite.props.dead) {
                this.sprite.setVisible(false);
                //this.sprite.props.emote.setVisible(false);
                this.sprite.x = 0;
                this.sprite.y = 0;
                return;
            }
            // invincible sprite: don't let move, decrement timer, make clear
            if (this.sprite.props.invincible) {
                this.sprite.alpha = 0.35
                //this.sprite.props.invincibility_timer -= 1;
                //if (this.sprite.props.invincibility_timer == 0) {
                if (frame_number >= this.sprite.props.invincibility_timer + 50) {
                    this.sprite.props.invincible = false;
                    this.sprite.alpha = 1;
                }
            }
            // don't update position while exploding
            if (this.sprite.props.exploding) {
                return;
            }
            // update position
            if (move_left) {
                this.sprite.x = Math.max(this.sprite.x - this.sprite.props.speed, min_x);
            } else if (move_right) {
                this.sprite.x = Math.min(this.sprite.x + this.sprite.props.speed, canvas_width - obj_width);
            } 
            // add bullet
            if (shoot && !this.sprite.props.invincible) {
            
                this.sprite.props.last_shot_frame = frame_number;
                this.sprite.props.last_shot_time = Date.now();
                fire_bullet(this.bullets_group, this.sprite.x, this.sprite.y - 50, -1, SHIP_BULLET_SPEED);
                sound.play();
            }

            // change ship colour if needed
            if (support == 1) {
                ai_supporting = 1;
                this.sprite.setTexture('ai_ship');
            } else if (support == 2) {
                ai_supporting = 2;
                this.sprite.setTexture('ai_ship');
            } else if (support == 0) {
                ai_ship.sprite.props.dead = true;
                ai_over = true;
                // timer = 60;
            }

            this.sprite.props.message.x = this.sprite.x;

            //this.sprite.props.emote.x = this.sprite.x;
        },
    };
}


/**
 * Create a group of enemies
 * @param {string} label label for game logs
 * @param {int} num_horizontal number of columns in the group 
 * @param {int} x horizontal position of the group
 * @param {int} y vertical position of the group
 * @param {int} vertical_speed vertical speed (should be positive)
 * @param {int} horizontal_speed horizontal speed (should be positive)
 * @param {String} bullet_image_id image id for the enemy bullets
 * @param {int} min_x minimum horizontal position for an enemy (when it reaches this edge, it switches direction)
 * @param {int} max_x maximum horizontal position for an enemy (when it reaches this edge, it switches direction)
 * @param {Array} num_rows number of rows per enemy (1, 2, and 3). Must be an array with 3 ints.
 */
function create_enemies(label="LEFT",num_horizontal = 5, x, y, g = "a", max_vel = 5, horizontal_speed = 10, 
                        bullet_image_id = "enemylaser", min_x = 0, max_x = 400, num_rows = [1, 2, 2])
{
    var canvas_width = this.sys.canvas.width                                    //!< width of the canvas
    var explosions = ['explosionpurple', 'explosionblue', 'explosiongreen'];    //!< name of explosion for each enemy (from 1 to 3)
    var enemies = this.physics.add.group();   // group of enemies
    enemies.label = label;

    // create animations for all enemies, animations for explosions, and groups of robots
    for (var e=1; e<4; e++) {
        // animation for the enemy
        if (!(this.anims.get('enemy' + e + g + '_move'))) {
            this.anims.create({
                key: 'enemy' + e + g + '_move',
                frames: [
                    { key: 'enemy' + e + g + '_1' },
                    { key: 'enemy' + e + g + '_2' },
                ],
                frameRate: 2,
                repeat: -1
            });
            // animation for the enemy explosion
            this.anims.create({
                key: 'enemy' + e + g + '_exp',
                frames: [{ key: explosions[e - 1] }],
                frameRate: 10,
            });
        }
        // add actual enemies to the enemies group 
        for (var i=0; i<num_horizontal * num_rows[e - 1]; i++) {
            enemy = this.physics.add.sprite(400, 300, 'enemy' + e + g + '_1').play('enemy' + e + g + '_move');
            enemy.setOrigin(0.5, 1.0);
            enemy.displayWidth = 50;
            enemy.scaleY = enemy.scaleX;
            enemy.body.maxVelocity.y = max_vel;
            enemy.explote_anim = 'enemy' + e + g + '_exp';
            // add extra parameters to know what is the position of the enemy in the grid
            enemy.grid_row = Math.floor(i / num_horizontal);
            for (var j=e-2; j >= 0; j--) {
                enemy.grid_row += num_rows[j];
            }
            enemy.grid_column = i % num_horizontal;
            enemy.score = 10 //+ 10 * (num_rows[0] + num_rows[1] + num_rows[2] - 1 - enemy.grid_row);
            enemy.hit = false;
            enemy.is_hit = false;
            enemies.add(enemy);
            enemy.time_hit = -1;
            enemy.e = e;
            enemy.g = g;
            enemy.i = i;
            enemy.max_vel = max_vel;
            enemy.num_horizontal = num_horizontal;
            enemy.shot_frame = -99999;
            // enemy.visible = true;
        }
    }
    // align group enemies in a grid
    Phaser.Actions.GridAlign(enemies.getChildren(), 
    { width: num_horizontal, height: 5, cellWidth: 60, cellHeight: 50, position: Phaser.Display.Align.CENTER, x: x, y: y });
    // set initial velocity for group
    Phaser.Actions.Call(enemies.getChildren(), function(e) {
        e.setVelocityX(-horizontal_speed);
        e.setVelocityY(0);
    })
    // store number of columns in the grid
    var children = enemies.getChildren();
    enemies.num_columns = num_horizontal;
    enemies.num_valid_columns = enemies.num_columns;
    // console.log("children", children);
    if (children.length == 0) {
        enemies.num_rows = 0;
    } else {
        enemies.num_rows = children[children.length - 1].grid_row;
    }
    

    // create bullets pool
    var bullets = this.create_bullets_pool(30, bullet_image_id, true);
    var sound = this.custom_sounds.fire_enemy;

    // create timer to fire enemy bullets
    enemies.fire_timer = this.time.addEvent({ delay: Phaser.Math.Between(700, 1000), loop: true, 
                                              callback: () => { 
                                                console.log("Enemy firing bullet with initial delay at", new Date().toISOString());
                                                    fire_enemy_bullet(enemies, bullets);
                                              } });
                                              
    enemies.timer_changes = 0;

    return {
        enemies_group: enemies,                //!< enemies group
        bullets_group: bullets,                //!< bullets group
        update(margin = 10)                    //!< update the enemies state
        {
            // move right?
            left_enemy = this.enemies_group.getChildren().find(function(e){
                return e.body.x < min_x;
            });
            if (typeof left_enemy != 'undefined') {
                Phaser.Actions.Call(this.enemies_group.getChildren(), function(e) {
                    e.setVelocityX(horizontal_speed)
                })
            } else { // move left?
                right_enemy = this.enemies_group.getChildren().find(function(e){
                    return e.body.x + e.body.width > max_x;
                });
                if (typeof right_enemy != 'undefined') {
                    Phaser.Actions.Call(this.enemies_group.getChildren(), function(e) {
                        e.setVelocityX(-horizontal_speed)
                    })
                }
            }

            // change timer depending on how many valid columns are left
            if (this.enemies_group.num_valid_columns <= 0.6 * enemy_shoot_timer_level &&
                this.enemies_group.timer_changes == 0) {
                this.enemies_group.fire_timer.reset({ delay: Phaser.Math.Between(1000, 1500), loop: true, 
                                              callback: () => { 
                                                    fire_enemy_bullet(enemies, bullets);
                                              } });
                this.enemies_group.timer_changes += 1;
            }
            else if (this.enemies_group.num_valid_columns <= 0.2 * enemy_shoot_timer_level &&
                this.enemies_group.timer_changes == 1) {
                this.enemies_group.fire_timer.reset({ delay: Phaser.Math.Between(1500, 2000), loop: true, 
                                              callback: () => { 
                                                    fire_enemy_bullet(enemies, bullets);
                                              } });
                this.enemies_group.timer_changes += 1;
            }
            var enemy_group_children = this.enemies_group.getChildren();
            // // console.log(enemy_group_children);
            // // console.log(enemy_group_children.length);
            for (var i = 0; i < enemy_group_children.length; i++) {
                // console.log("in for loop");
                var current_enemy = enemy_group_children[i];
                if (current_enemy.is_hit == true && frame_number - 300 > current_enemy.shot_frame) {
                    current_enemy.is_hit = false;
                    // current_enemy.setTexture('enemy' + enemy.e + enemy.g + '_1');
                    current_enemy.setVisible(true);
                }
            }
        },
    };
}

function create_text() {
    var gameover_text = this.add.bitmapText(ai_ship.sprite.x, ai_ship.sprite.y + 25, 'PressStart2P_Orange', 'Sorry!', 10).setOrigin(0.5);
}