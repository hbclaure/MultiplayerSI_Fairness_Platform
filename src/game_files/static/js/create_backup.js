// --- helper functions ---

/**
 * Create world objects and collider functions
 */
function create ()
{	
    // console.log("create");
    // a log of all of the frames of the game
    frames = [];
    frame_number = 0;
    last_frame = -1;
    date = new Date();
    events = [];

    // game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

    // game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    // game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    // game.scale.refresh();

    // game.input.onDown.add(gofull, this);

    // function gofull() {
    //     // if (game.scale.isFullScreen) {
    //     //     game.scale.stopFullScreen();
    //     // } else {
    //     //     game.scale.startFullScreen(false);
    //     // }
    //     game.scale.resize(window.innerWidth, window.innerHeight);
    // }

	// flag to tell when the game is over
    player_over = false;
    ai_over = false;

    // debug_text flag to run debugging text in developer tools
    debug_text = false;

    cursors = this.input.keyboard.createCursorKeys();
    space_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyG = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);

    // fullscreen
    keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    keyF.on('down', function () {
        if (this.scale.isFullscreen) {
            this.scale.stopFullscreen();
        } else {
            this.scale.startFullscreen();
        }
    }, this);

    this.custom_sounds = {};   // add sound object so that we can easily access the sounds in the scene  
    this.custom_sounds.enemy_explosion = this.sound.add("audio_explosion", {volume: 0.05});
    this.custom_sounds.player_explosion = this.sound.add("audio_explosion", {volume: 0.1});
    this.custom_sounds.fire_ship = this.sound.add("audio_fire_ship", {volume: 0.05});

    //setting the left wall for the AI depending on what kind of agent it is
    ai_ship = this.create_ship(0, "jordan", 1, this.sys.canvas.width / 4 + 400, 540, 5, "laser", 0, 30);
    let ship1 = this.create_ship(1, "ship", 0, this.sys.canvas.width / 2, 540);
    let ship2 = this.create_ship(2, "ship2", 0, this.sys.canvas.width / 4, 540);
    players.push(ship1);
    players.push(ship2);
    console.log(players);
    console.log("created ships");


    // var minX = 0;
    // if (mode == UNCOOPERATIVE) {
    //     minX = 425;
    //     ai_ship = this.create_ship("avery", 1, this.sys.canvas.width / 4 + 400, 540, 5, "laser", minX);
    // }
    // else  {
    //     ai_ship = this.create_ship("jordan", 1, this.sys.canvas.width / 4 + 400, 540, 5, "laser", minX);
    // }

    //creating the enemies on the left and right
    var enemy_rows = 5;
    enemies_left = this.create_enemies(13, 30, 0, "a", 5, 10, "enemylaser", min_x = 0, max_x = 800);
    // enemies_left = this.create_enemies(4, 30, 0, "a", 5, 10, "enemylaser", min_x = 0, max_x = 255);
    enemies_right = this.create_enemies(0, 630, 0, "b", 5, 10, "enemylaser", min_x = 550, max_x = 800);
    enemies_middle = this.create_enemies(0, 300, 0, "c", 5, 10, "enemylaser", min_x = 280, max_x = 525);

    for (let s = 0; s < 2; s++) {

        // --> COLLIDERS <--
        // --> enemies hit by player_ship bullets 
        this.physics.add.collider(enemies_left.enemies_group, players[s].bullets_group, (enemy, bullet) => {
            // destroy the enemy
            this.custom_sounds.enemy_explosion.play();
            enemy.play(enemy.explote_anim, true);
            enemy.on('animationcomplete', () => {
                enemy.destroy();
            });
            // hide the bullet 
            bullet.body.x = this.sys.canvas.width;
            bullet.body.y = this.sys.canvas.height;
            bullet.setActive(false);
            // update the score     
            if (enemy.hit == false) {   
            players[s].sprite.props.score += enemy.score;
            //    player_ship.sprite.props.scoreText.setText("SCORE " + player_ship.sprite.props.score); 	

            total_score += enemy.score;
            score_text.setText("SCORE " + total_score);
            events.push({frame: frame_number, killer: 'PLAYER', killed: 'LEFT', type: 'SHOT'});
            }
            enemy.hit = true;
        });
        // this.physics.add.collider(enemies_right.enemies_group, players[s].bullets_group, (enemy, bullet) => {
        //     // destroy the enemy
        //     this.custom_sounds.enemy_explosion.play();
        //     enemy.play(enemy.explote_anim, true);
        //     enemy.on('animationcomplete', () => {
        //         enemy.destroy();
        //     });
        //     // hide the bullet 
        //     bullet.body.x = this.sys.canvas.width;
        //     bullet.body.y = this.sys.canvas.height;
        //     bullet.setActive(false);
        //     // update the score
        //     if (enemy.hit == false) {
        //     ai_ship.sprite.props.score += enemy.score;
        //     //    ai_ship.sprite.props.scoreText.setText("SCORE " + ai_ship.sprite.props.score);

        //     total_score += enemy.score;
        //     score_text.setText("SCORE " + total_score);
        //     events.push({frame: frame_number, killer: 'PLAYER', killed: 'RIGHT', type: 'SHOT'});
        //     }
        //     enemy.hit = true;
        // });
        // this.physics.add.collider(enemies_middle.enemies_group, players[s].bullets_group, (enemy, bullet) => {
        //     // destroy the enemy
        //     this.custom_sounds.enemy_explosion.play();
        //     enemy.play(enemy.explote_anim, true);
        //     enemy.on('animationcomplete', () => {
        //         enemy.destroy();
        //     });
        //     // hide the bullet 
        //     bullet.body.x = this.sys.canvas.width;
        //     bullet.body.y = this.sys.canvas.height;
        //     bullet.setActive(false);
        //     // update the score
        //     if (enemy.hit == false) {
        //     ai_ship.sprite.props.score += enemy.score;
        //     //    ai_ship.sprite.props.scoreText.setText("SCORE " + ai_ship.sprite.props.score);

        //     total_score += enemy.score;
        //     score_text.setText("SCORE " + total_score);
        //     events.push({frame: frame_number, killer: 'PLAYER', killed: 'MIDDLE', type: 'SHOT'});
        //     }
        //     enemy.hit = true;
        // });

        // --> enemies hit by Ai ship's bullets
        this.physics.add.collider(enemies_left.enemies_group, ai_ship.bullets_group, (enemy, bullet) => {
            // destroy the enemy
            this.custom_sounds.enemy_explosion.play();
            enemy.play(enemy.explote_anim, true);
            enemy.on('animationcomplete', () => {
                enemy.destroy();
            });
            // hide the bullet 
            bullet.body.x = this.sys.canvas.width;
            bullet.body.y = this.sys.canvas.height;
            bullet.setActive(false);
            // update the score
            if (enemy.hit == false) {
                players[s].sprite.props.score += enemy.score;
                // player_ship.sprite.props.scoreText.setText("SCORE " + player_ship.sprite.props.score);

                total_score += enemy.score;
                score_text.setText("SCORE " + total_score);
                events.push({frame: frame_number, killer: 'AI', killed: 'LEFT', type: 'SHOT'});
            }
            enemy.hit = true;
        });
        // this.physics.add.collider(enemies_right.enemies_group, ai_ship.bullets_group, (enemy, bullet) => {
        //     // destroy the enemy
        //     this.custom_sounds.enemy_explosion.play();
        //     enemy.play(enemy.explote_anim, true);
        //     enemy.on('animationcomplete', () => {
        //         enemy.destroy();
        //     });
        //     // hide the bullet 
        //     bullet.body.x = this.sys.canvas.width;
        //     bullet.body.y = this.sys.canvas.height;
        //     bullet.setActive(false);
        //     // update the score
        //     if (enemy.hit == false) {
        //         ai_ship.sprite.props.score += enemy.score;
        //         // ai_ship.sprite.props.scoreText.setText("SCORE " + ai_ship.sprite.props.score);

        //         total_score += enemy.score;
        //         score_text.setText("SCORE " + total_score);
        //         events.push({frame: frame_number, killer: 'AI', killed: 'RIGHT', type: 'SHOT'});
        //     }
        //     enemy.hit = true;
        // });
        // this.physics.add.collider(enemies_middle.enemies_group, ai_ship.bullets_group, (enemy, bullet) => {
        //     // destroy the enemy
        //     this.custom_sounds.enemy_explosion.play();
        //     enemy.play(enemy.explote_anim, true);
        //     enemy.on('animationcomplete', () => {
        //         enemy.destroy();
        //     });
        //     // hide the bullet 
        //     bullet.body.x = this.sys.canvas.width;
        //     bullet.body.y = this.sys.canvas.height;
        //     bullet.setActive(false);
        //     // update the score
        //     if (enemy.hit == false) {
        //         ai_ship.sprite.props.score += enemy.score;
        //         // ai_ship.sprite.props.scoreText.setText("SCORE " + ai_ship.sprite.props.score);

        //         total_score += enemy.score;
        //         score_text.setText("SCORE " + total_score);
        //         events.push({frame: frame_number, killer: 'AI', killed: 'MIDDLE', type: 'SHOT'});
        //     }
        //     enemy.hit = true;
        // });

        // --> enemies bullets hit ships bullets
        this.physics.add.collider(enemies_left.bullets_group, players[s].bullets_group, (enemy_bullet, ship_bullet) => {
            // hide both bullets 
            enemy_bullet.body.x = this.sys.canvas.width;
            enemy_bullet.body.y = this.sys.canvas.height;
            ship_bullet.body.x = this.sys.canvas.width;
            ship_bullet.body.y = this.sys.canvas.height;
            enemy_bullet.setActive(false);
            ship_bullet.setActive(false);
        });
        // this.physics.add.collider(enemies_right.bullets_group, players[s].bullets_group, (enemy_bullet, ship_bullet) => {
        //     // hide both bullets 
        //     enemy_bullet.body.x = this.sys.canvas.width;
        //     enemy_bullet.body.y = this.sys.canvas.height;
        //     ship_bullet.body.x = this.sys.canvas.width;
        //     ship_bullet.body.y = this.sys.canvas.height;
        //     enemy_bullet.setActive(false);
        //     ship_bullet.setActive(false);
        // });
        // this.physics.add.collider(enemies_middle.bullets_group, players[s].bullets_group, (enemy_bullet, ship_bullet) => {
        //     // hide both bullets 
        //     enemy_bullet.body.x = this.sys.canvas.width;
        //     enemy_bullet.body.y = this.sys.canvas.height;
        //     ship_bullet.body.x = this.sys.canvas.width;
        //     ship_bullet.body.y = this.sys.canvas.height;
        //     enemy_bullet.setActive(false);
        //     ship_bullet.setActive(false);
        // });

        // --> enemies bullets hit AI ship's bullets
        this.physics.add.collider(enemies_left.bullets_group, ai_ship.bullets_group, (enemy_bullet, ship_bullet) => {
            // hide both bullets 
            enemy_bullet.body.x = this.sys.canvas.width;
            enemy_bullet.body.y = this.sys.canvas.height;
            ship_bullet.body.x = this.sys.canvas.width;
            ship_bullet.body.y = this.sys.canvas.height;
            enemy_bullet.setActive(false);
            ship_bullet.setActive(false);
        });
        // this.physics.add.collider(enemies_right.bullets_group, ai_ship.bullets_group, (enemy_bullet, ship_bullet) => {
        //     // hide both bullets 
        //     enemy_bullet.body.x = this.sys.canvas.width;
        //     enemy_bullet.body.y = this.sys.canvas.height;
        //     ship_bullet.body.x = this.sys.canvas.width;
        //     ship_bullet.body.y = this.sys.canvas.height;
        //     enemy_bullet.setActive(false);
        //     ship_bullet.setActive(false);
        // });
        // this.physics.add.collider(enemies_middle.bullets_group, ai_ship.bullets_group, (enemy_bullet, ship_bullet) => {
        //     // hide both bullets 
        //     enemy_bullet.body.x = this.sys.canvas.width;
        //     enemy_bullet.body.y = this.sys.canvas.height;
        //     ship_bullet.body.x = this.sys.canvas.width;
        //     ship_bullet.body.y = this.sys.canvas.height;
        //     enemy_bullet.setActive(false);
        //     ship_bullet.setActive(false);
        // });

        // --> enemies bullets hit player_ship
        this.physics.add.collider(players[s].sprite, enemies_left.bullets_group, (ship_sprite, bullet) => {
            // hide the bullet 
            bullet.body.x = this.sys.canvas.width;
            bullet.body.y = this.sys.canvas.height;
            bullet.setActive(false);

            if (ship_sprite.props.invincible) { }
            // kill the player. The change in behavior takes place within the update function of the ship
            else if (ship_sprite.props.lives > 1) {
                // give the player 50 frames of invincibility
                ship_sprite.props.invincible = true;
                // ship_sprite.props.invincibility_timer = 50;
                ship_sprite.props.invincibility_timer = frame_number;
                events.push({frame: frame_number, killer: 'LEFT', killed: 'PLAYER', type: 'SHOT'});
                this.custom_sounds.player_explosion.play();
                ship_sprite.props.exploding = true;
                ship_sprite.props.lives -= 1;
                ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
                ship_sprite.play(ship_sprite.explote_anim, true);
                ship_sprite.on('animationcomplete', () => {
                    ship_sprite.x = this.sys.canvas.width / 2;
                    ship_sprite.setTexture(ship_sprite.props.image_id);
                    ship_sprite.props.exploding = false;
                });
            }
            else {
                events.push({frame: frame_number, killer: 'LEFT', killed: 'PLAYER', type: 'SHOT'});
                this.custom_sounds.player_explosion.play();
                ship_sprite.props.dead = true;
                ship_sprite.props.lives -= 1;
                ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
                player_over = true;
            }
        });
        // this.physics.add.collider(players[s].sprite, enemies_right.bullets_group, (ship_sprite, bullet) => {
        //     // hide the bullet 
        //     bullet.body.x = this.sys.canvas.width;
        //     bullet.body.y = this.sys.canvas.height;
        //     bullet.setActive(false);
        //     if (ship_sprite.props.invincible) { }
        //     // kill the player. The change in behavior takes place within the update function of the ship
        //     else if (ship_sprite.props.lives > 1) {
        //         // give the player 50 frames of invincibility
        //         ship_sprite.props.invincible = true;
        //         ship_sprite.props.invincibility_timer = frame_number;
        //         events.push({frame: frame_number, killer: 'RIGHT', killed: 'PLAYER', type: 'SHOT'});
        //         this.custom_sounds.player_explosion.play();
        //         ship_sprite.props.exploding = true;
        //         ship_sprite.props.lives -= 1;
        //         ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
        //         ship_sprite.play(ship_sprite.explote_anim, true);
        //         ship_sprite.on('animationcomplete', () => {
        //             ship_sprite.x = this.sys.canvas.width / 2;
        //             ship_sprite.setTexture(ship_sprite.props.image_id);
        //             ship_sprite.props.exploding = false;
        //         });
        //     }
        //     else {
        //         events.push({frame: frame_number, killer: 'RIGHT', killed: 'PLAYER', type: 'SHOT'});
        //         this.custom_sounds.player_explosion.play();
        //         ship_sprite.props.dead = true;
        //         ship_sprite.props.lives -= 1;
        //         ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
        //         player_over = true;
        //     }
        // });
        // this.physics.add.collider(players[s].sprite, enemies_middle.bullets_group, (ship_sprite, bullet) => {
        //     // hide the bullet 
        //     bullet.body.x = this.sys.canvas.width;
        //     bullet.body.y = this.sys.canvas.height;
        //     bullet.setActive(false);
        //     if (ship_sprite.props.invincible) { }
        //     // kill the player. The change in behavior takes place within the update function of the ship
        //     else if (ship_sprite.props.lives > 1) {
        //         // give the player 50 frames of invincibility
        //         ship_sprite.props.invincible = true;
        //         ship_sprite.props.invincibility_timer = frame_number;
        //         events.push({frame: frame_number, killer: 'MIDDLE', killed: 'PLAYER', type: 'SHOT'});
        //         this.custom_sounds.player_explosion.play();
        //         ship_sprite.props.exploding = true;
        //         ship_sprite.props.lives -= 1;
        //         ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
        //         ship_sprite.play(ship_sprite.explote_anim, true);
        //         ship_sprite.on('animationcomplete', () => {
        //             ship_sprite.x = this.sys.canvas.width / 2;
        //             ship_sprite.setTexture(ship_sprite.props.image_id);
        //             ship_sprite.props.exploding = false;
        //         });
        //     }
        //     else {
        //         events.push({frame: frame_number, killer: 'MIDDLE', killed: 'PLAYER', type: 'SHOT'});
        //         this.custom_sounds.player_explosion.play();
        //         ship_sprite.props.dead = true;
        //         ship_sprite.props.lives -= 1;
        //         ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
        //         player_over = true;
        //     }
        // });

        // --> enemies bullets hit ai_ship
        // this.physics.add.collider(ai_ship.sprite, enemies_right.bullets_group, (ship_sprite, bullet) => {
        //     // hide the bullet 
        //     bullet.body.x = this.sys.canvas.width;
        //     bullet.body.y = this.sys.canvas.height;
        //     bullet.setActive(false);
        //     if (ship_sprite.props.invincible) { }
        //     // kill the player. The change in behavior takes place within the update function of the ship
        //     else if (ship_sprite.props.lives > 1) {
        //         // give the player 50 frames of invincibility
        //         ship_sprite.props.invincible = true;
        //         ship_sprite.props.invincibility_timer = frame_number;
        //         events.push({frame: frame_number, killer: 'RIGHT', killed: 'AI', type: 'SHOT'});
        //         this.custom_sounds.player_explosion.play();
        //         ship_sprite.props.exploding = true;
        //         ship_sprite.props.lives -= 1;
        //         ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
        //         ship_sprite.play(ship_sprite.explote_anim, true);
        //         ship_sprite.on('animationcomplete', () => {
        //             ship_sprite.x = this.sys.canvas.width / 2 + 25;
        //             ship_sprite.setTexture(ship_sprite.props.image_id);
        //             ship_sprite.props.exploding = false;
        //         });
        //     }
        //     else {
        //         events.push({frame: frame_number, killer: 'RIGHT', killed: 'AI', type: 'SHOT'});
        //         this.custom_sounds.player_explosion.play();
        //         ship_sprite.props.exploding = true;
        //         ship_sprite.play(ship_sprite.explote_anim, true);
        //         ship_sprite.on('animationcomplete', () => {
        //             ship_sprite.setTexture(ship_sprite.props.image_id);
        //             ship_sprite.props.exploding = false;
        //             ship_sprite.props.lives -= 1;
        //             ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
        //             ship_sprite.props.dead = true;
        //         });
        //         ai_over = true;
        //         //console.log("AI OVER");
        //     }
        // });
        this.physics.add.collider(ai_ship.sprite, enemies_left.bullets_group, (ship_sprite, bullet) => {
            // hide the bullet 
            bullet.body.x = this.sys.canvas.width;
            bullet.body.y = this.sys.canvas.height;
            bullet.setActive(false);
            if (ship_sprite.props.invincible) { }
            // kill the player. The change in behavior takes place within the update function of the ship
            else if (ship_sprite.props.lives > 1) {
                // give the player 50 frames of invincibility
                ship_sprite.props.invincible = true;
                ship_sprite.props.invincibility_timer = frame_number;
                events.push({frame: frame_number, killer: 'LEFT', killed: 'AI', type: 'SHOT'});
                this.custom_sounds.player_explosion.play();
                ship_sprite.props.exploding = true;
                ship_sprite.props.lives -= 1;
                ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
                ship_sprite.play(ship_sprite.explote_anim, true);
                ship_sprite.on('animationcomplete', () => {
                    ship_sprite.x = this.sys.canvas.width / 2 + 25;
                    ship_sprite.setTexture(ship_sprite.props.image_id);
                    ship_sprite.props.exploding = false;
                });
            }
            else {
                events.push({frame: frame_number, killer: 'LEFT', killed: 'AI', type: 'SHOT'});
                this.custom_sounds.player_explosion.play();
                ship_sprite.props.exploding = true;
                ship_sprite.play(ship_sprite.explote_anim, true);
                ship_sprite.on('animationcomplete', () => {
                    ship_sprite.setTexture(ship_sprite.props.image_id);
                    ship_sprite.props.exploding = false;
                    ship_sprite.props.lives -= 1;
                    ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
                    ship_sprite.props.dead = true;
                });
                ai_over = true;
                //console.log("AI OVER");
            }
        });
        // this.physics.add.collider(ai_ship.sprite, enemies_middle.bullets_group, (ship_sprite, bullet) => {
        //     // hide the bullet 
        //     bullet.body.x = this.sys.canvas.width;
        //     bullet.body.y = this.sys.canvas.height;
        //     bullet.setActive(false);
        //     if (ship_sprite.props.invincible) { }
        //     // kill the player. The change in behavior takes place within the update function of the ship
        //     else if (ship_sprite.props.lives > 1) {
        //         // give the player 50 frames of invincibility
        //         ship_sprite.props.invincible = true;
        //         ship_sprite.props.invincibility_timer = frame_number;
        //         events.push({frame: frame_number, killer: 'MIDDLE', killed: 'AI', type: 'SHOT'});
        //         this.custom_sounds.player_explosion.play();
        //         ship_sprite.props.exploding = true;
        //         ship_sprite.props.lives -= 1;
        //         ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
        //         ship_sprite.play(ship_sprite.explote_anim, true);
        //         ship_sprite.on('animationcomplete', () => {
        //             ship_sprite.x = this.sys.canvas.width / 2 + 25;
        //             ship_sprite.setTexture(ship_sprite.props.image_id);
        //             ship_sprite.props.exploding = false;
        //         });
        //     }
        //     else {
        //         events.push({frame: frame_number, killer: 'MIDDLE', killed: 'AI', type: 'SHOT'});
        //         this.custom_sounds.player_explosion.play();
        //         ship_sprite.props.exploding = true;
        //         ship_sprite.play(ship_sprite.explote_anim, true);
        //         ship_sprite.on('animationcomplete', () => {
        //             ship_sprite.setTexture(ship_sprite.props.image_id);
        //             ship_sprite.props.exploding = false;
        //             ship_sprite.props.lives -= 1;
        //             ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
        //             ship_sprite.props.dead = true;
        //         });
        //         ai_over = true;
        //         //console.log("AI OVER");
        //     }
        // });


        // --> enemies hit player_ship
        this.physics.add.collider(players[s].sprite, enemies_left.enemies_group, (ship_sprite, enemy) => {
            if (!enemy.hit) {
                // play sounds
                this.custom_sounds.player_explosion.play();
                this.custom_sounds.enemy_explosion.play();
                // update the score
                // ship_sprite.props.score += enemy.score;
                // ship_sprite.props.scoreText.setText("SCORE " + ship_sprite.props.score);
                total_score += enemy.score;
                score_text.setText("SCORE " + total_score);
                // kill the player and the enemy. The change in behavior takes place within the update function of the ship
                if (ship_sprite.props.lives > 1) {
                    ship_sprite.props.exploding = true;
                    ship_sprite.props.lives -= 1;
                    ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
                }
                else {
                    ship_sprite.props.dead = true;
                    ship_sprite.props.lives -= 1;
                    ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
                    player_over = true;
                }
                ship_sprite.play(ship_sprite.explote_anim, true);
                enemy.play(enemy.explote_anim, true);
                ship_sprite.on('animationcomplete', () => {
                    ship_sprite.x = this.sys.canvas.width / 2;
                    ship_sprite.setTexture(ship_sprite.props.image_id);
                    ship_sprite.props.exploding = false;
                });
                enemy.on('animationcomplete', () => {
                    enemy.destroy();
                });
                enemy.hit = true;
                events.push({frame: frame_number, killer: 'LEFT', killed: 'PLAYER', type: 'COLLISION'});
                events.push({frame: frame_number, killer: 'PLAYER', killed: 'LEFT', type: 'COLLISION'});
            }
        });
        // this.physics.add.collider(players[s].sprite, enemies_right.enemies_group, (ship_sprite, enemy) => {
        //     if (!enemy.hit) {
        //         // play sound
        //         this.custom_sounds.player_explosion.play();
        //         this.custom_sounds.enemy_explosion.play();
        //         // update the score
        //         // ai_ship.sprite.props.score += enemy.score;
        //         // ai_ship.sprite.props.scoreText.setText("SCORE " + ai_ship.sprite.props.score);
        //         total_score += enemy.score;
        //         score_text.setText("SCORE " + total_score);
        //         // kill the player and the enemy. The change in behavior takes place within the update function of the ship
        //         if (ship_sprite.props.lives > 1) {
        //             ship_sprite.props.exploding = true;
        //             ship_sprite.props.lives -= 1;
        //             ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
        //         }
        //         else {
        //             ship_sprite.props.dead = true;
        //             ship_sprite.props.lives -= 1;
        //             ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
        //             player_over = true;
        //         }
        //         ship_sprite.play(ship_sprite.explote_anim, true);
        //         enemy.play(enemy.explote_anim, true);
        //         ship_sprite.on('animationcomplete', () => {
        //             ship_sprite.x = this.sys.canvas.width / 2;
        //             ship_sprite.setTexture(ship_sprite.props.image_id);
        //             ship_sprite.props.exploding = false;
        //         });
        //         enemy.on('animationcomplete', () => {
        //             enemy.destroy();
        //         });
        //         enemy.hit = true;
        //         events.push({frame: frame_number, killer: 'RIGHT', killed: 'PLAYER', type: 'COLLISION'});
        //         events.push({frame: frame_number, killer: 'PLAYER', killed: 'RIGHT', type: 'COLLISION'});
        //     }
        // });
        // this.physics.add.collider(players[s].sprite, enemies_middle.enemies_group, (ship_sprite, enemy) => {
        //     if (!enemy.hit) {
        //         // play sound
        //         this.custom_sounds.player_explosion.play();
        //         this.custom_sounds.enemy_explosion.play();
        //         // update the score
        //         // ai_ship.sprite.props.score += enemy.score;
        //         // ai_ship.sprite.props.scoreText.setText("SCORE " + ai_ship.sprite.props.score);
        //         total_score += enemy.score;
        //         score_text.setText("SCORE " + total_score);
        //         // kill the player and the enemy. The change in behavior takes place within the update function of the ship
        //         if (ship_sprite.props.lives > 1) {
        //             ship_sprite.props.exploding = true;
        //             ship_sprite.props.lives -= 1;
        //             ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
        //         }
        //         else {
        //             ship_sprite.props.dead = true;
        //             ship_sprite.props.lives -= 1;
        //             ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
        //             player_over = true;
        //         }
        //         ship_sprite.play(ship_sprite.explote_anim, true);
        //         enemy.play(enemy.explote_anim, true);
        //         ship_sprite.on('animationcomplete', () => {
        //             ship_sprite.x = this.sys.canvas.width / 2;
        //             ship_sprite.setTexture(ship_sprite.props.image_id);
        //             ship_sprite.props.exploding = false;
        //         });
        //         enemy.on('animationcomplete', () => {
        //             enemy.destroy();
        //         });
        //         enemy.hit = true;
        //         events.push({frame: frame_number, killer: 'MIDDLE', killed: 'PLAYER', type: 'COLLISION'});
        //         events.push({frame: frame_number, killer: 'PLAYER', killed: 'MIDDLE', type: 'COLLISION'});
        //     }
        // });

        // --> enemies hit ai_ship
        this.physics.add.collider(ai_ship.sprite, enemies_left.enemies_group, (ship_sprite, enemy) => {
            if (!enemy.hit) {
                // play sounds
                this.custom_sounds.player_explosion.play();
                this.custom_sounds.enemy_explosion.play();
            
                // update the score
                // player_ship.sprite.props.score += enemy.score;
                // player_ship.sprite.props.scoreText.setText("SCORE " + player_ship.sprite.props.score);
                total_score += enemy.score;
                score_text.setText("SCORE " + total_score);
                // kill the player and the enemy. The change in behavior takes place within the update function of the ship
                if (ship_sprite.props.lives > 1) {
                    ship_sprite.props.exploding = true;
                    ship_sprite.props.lives -= 1;
                    ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
                }
                else {
                    ship_sprite.props.dead = true;
                    ship_sprite.props.lives -= 1;
                    ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
                    ai_over = true;
                }
                ship_sprite.play(ship_sprite.explote_anim, true);
                enemy.play(enemy.explote_anim, true);
                ship_sprite.on('animationcomplete', () => {
                    ship_sprite.x = this.sys.canvas.width / 2 + 25;
                    ship_sprite.setTexture(ship_sprite.props.image_id);
                    ship_sprite.props.exploding = false;
                });
                enemy.on('animationcomplete', () => {
                    enemy.destroy();
                });
                enemy.hit = true;
                events.push({frame: frame_number, killer: 'LEFT', killed: 'AI', type: 'COLLISION'});
                events.push({frame: frame_number, killer: 'AI', killed: 'LEFT', type: 'COLLISION'});
            }
        });
        // this.physics.add.collider(ai_ship.sprite, enemies_right.enemies_group, (ship_sprite, enemy) => {
        //     if (!enemy.hit) {
        //         // play sounds
        //         this.custom_sounds.player_explosion.play();
        //         this.custom_sounds.enemy_explosion.play();
            
        //         // update the score
        //         // ship_sprite.props.score += enemy.score;
        //         // ship_sprite.props.scoreText.setText("SCORE " + ship_sprite.props.score);
        //         total_score += enemy.score;
        //         score_text.setText("SCORE " + total_score);
        //         // kill the player and the enemy. The change in behavior takes place within the update function of the ship
        //         if (ship_sprite.props.lives > 1) {
        //             ship_sprite.props.exploding = true;
        //             ship_sprite.props.lives -= 1;
        //             ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
        //         }
        //         else {
        //             ship_sprite.props.dead = true;
        //             ship_sprite.props.lives -= 1;
        //             ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
        //             ai_over = true;
        //         }
        //         ship_sprite.play(ship_sprite.explote_anim, true);
        //         enemy.play(enemy.explote_anim, true);
        //         ship_sprite.on('animationcomplete', () => {
        //             ship_sprite.x = this.sys.canvas.width / 2 + 25;
        //             ship_sprite.setTexture(ship_sprite.props.image_id);
        //             ship_sprite.props.exploding = false;
        //         });
        //         enemy.on('animationcomplete', () => {
        //             enemy.destroy();
        //         });
        //         enemy.hit = true;
        //         events.push({frame: frame_number, killer: 'RIGHT', killed: 'AI', type: 'COLLISION'});
        //         events.push({frame: frame_number, killer: 'AI', killed: 'RIGHT', type: 'COLLISION'});
        //     }
        // });
        // this.physics.add.collider(ai_ship.sprite, enemies_middle.enemies_group, (ship_sprite, enemy) => {
        //     if (!enemy.hit) {
        //         // play sounds
        //         this.custom_sounds.player_explosion.play();
        //         this.custom_sounds.enemy_explosion.play();
            
        //         // update the score
        //         // ship_sprite.props.score += enemy.score;
        //         // ship_sprite.props.scoreText.setText("SCORE " + ship_sprite.props.score);
        //         total_score += enemy.score;
        //         score_text.setText("SCORE " + total_score);
        //         // kill the player and the enemy. The change in behavior takes place within the update function of the ship
        //         if (ship_sprite.props.lives > 1) {
        //             ship_sprite.props.exploding = true;
        //             ship_sprite.props.lives -= 1;
        //             ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
        //         }
        //         else {
        //             ship_sprite.props.dead = true;
        //             ship_sprite.props.lives -= 1;
        //             ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
        //             ai_over = true;
        //         }
        //         ship_sprite.play(ship_sprite.explote_anim, true);
        //         enemy.play(enemy.explote_anim, true);
        //         ship_sprite.on('animationcomplete', () => {
        //             ship_sprite.x = this.sys.canvas.width / 2 + 25;
        //             ship_sprite.setTexture(ship_sprite.props.image_id);
        //             ship_sprite.props.exploding = false;
        //         });
        //         enemy.on('animationcomplete', () => {
        //             enemy.destroy();
        //         });
        //         enemy.hit = true;
        //         events.push({frame: frame_number, killer: 'MIDDLE', killed: 'AI', type: 'COLLISION'});
        //         events.push({frame: frame_number, killer: 'AI', killed: 'MIDDLE', type: 'COLLISION'});
        //     }
        // });
        
    }

    // // --> COLLIDERS <--
    // // --> enemies hit by player_ship bullets 
    // this.physics.add.collider(enemies_left.enemies_group, player_ship.bullets_group, (enemy, bullet) => {
    //     // destroy the enemy
    //     this.custom_sounds.enemy_explosion.play();
    //     enemy.play(enemy.explote_anim, true);
    //     enemy.on('animationcomplete', () => {
    //         enemy.destroy();
    //     });
    //     // hide the bullet 
    //     bullet.body.x = this.sys.canvas.width;
    //     bullet.body.y = this.sys.canvas.height;
    //     bullet.setActive(false);
    //     // update the score     
    //     if (enemy.hit == false) {   
    // 	   player_ship.sprite.props.score += enemy.score;
    // 	//    player_ship.sprite.props.scoreText.setText("SCORE " + player_ship.sprite.props.score); 	

    //        total_score += enemy.score;
    //        score_text.setText("SCORE " + total_score);
    //        events.push({frame: frame_number, killer: 'PLAYER', killed: 'LEFT', type: 'SHOT'});
    //     }
    //     enemy.hit = true;
    // });
	// this.physics.add.collider(enemies_right.enemies_group, player_ship.bullets_group, (enemy, bullet) => {
    //     // destroy the enemy
    //     this.custom_sounds.enemy_explosion.play();
    //     enemy.play(enemy.explote_anim, true);
    //     enemy.on('animationcomplete', () => {
    //         enemy.destroy();
    //     });
    //     // hide the bullet 
    //     bullet.body.x = this.sys.canvas.width;
    //     bullet.body.y = this.sys.canvas.height;
    //     bullet.setActive(false);
    //     // update the score
    //     if (enemy.hit == false) {
    // 	   ai_ship.sprite.props.score += enemy.score;
    // 	//    ai_ship.sprite.props.scoreText.setText("SCORE " + ai_ship.sprite.props.score);

    //        total_score += enemy.score;
    //        score_text.setText("SCORE " + total_score);
    //        events.push({frame: frame_number, killer: 'PLAYER', killed: 'RIGHT', type: 'SHOT'});
    //     }
    //     enemy.hit = true;
    // });

    // // --> enemies hit by Ai ship's bullets
    // this.physics.add.collider(enemies_left.enemies_group, ai_ship.bullets_group, (enemy, bullet) => {
    //     // destroy the enemy
    //     this.custom_sounds.enemy_explosion.play();
    //     enemy.play(enemy.explote_anim, true);
    //     enemy.on('animationcomplete', () => {
    //         enemy.destroy();
    //     });
    //     // hide the bullet 
    //     bullet.body.x = this.sys.canvas.width;
    //     bullet.body.y = this.sys.canvas.height;
    //     bullet.setActive(false);
    //     // update the score
    //     if (enemy.hit == false) {
    //         player_ship.sprite.props.score += enemy.score;
    //         // player_ship.sprite.props.scoreText.setText("SCORE " + player_ship.sprite.props.score);

    //         total_score += enemy.score;
    //         score_text.setText("SCORE " + total_score);
    //         events.push({frame: frame_number, killer: 'AI', killed: 'LEFT', type: 'SHOT'});
    //     }
    //     enemy.hit = true;
    // });
	// this.physics.add.collider(enemies_right.enemies_group, ai_ship.bullets_group, (enemy, bullet) => {
    //     // destroy the enemy
    //     this.custom_sounds.enemy_explosion.play();
    //     enemy.play(enemy.explote_anim, true);
    //     enemy.on('animationcomplete', () => {
    //         enemy.destroy();
    //     });
    //     // hide the bullet 
    //     bullet.body.x = this.sys.canvas.width;
    //     bullet.body.y = this.sys.canvas.height;
    //     bullet.setActive(false);
    //     // update the score
    //     if (enemy.hit == false) {
    //         ai_ship.sprite.props.score += enemy.score;
    //         // ai_ship.sprite.props.scoreText.setText("SCORE " + ai_ship.sprite.props.score);

    //         total_score += enemy.score;
    //         score_text.setText("SCORE " + total_score);
    //         events.push({frame: frame_number, killer: 'AI', killed: 'RIGHT', type: 'SHOT'});
    //     }
    //     enemy.hit = true;
    // });

    // // --> enemies bullets hit ships bullets
    // this.physics.add.collider(enemies_left.bullets_group, player_ship.bullets_group, (enemy_bullet, ship_bullet) => {
    //     // hide both bullets 
    //     enemy_bullet.body.x = this.sys.canvas.width;
    //     enemy_bullet.body.y = this.sys.canvas.height;
    //     ship_bullet.body.x = this.sys.canvas.width;
    //     ship_bullet.body.y = this.sys.canvas.height;
    //     enemy_bullet.setActive(false);
    //     ship_bullet.setActive(false);
    // });
    // this.physics.add.collider(enemies_right.bullets_group, player_ship.bullets_group, (enemy_bullet, ship_bullet) => {
    //     // hide both bullets 
    //     enemy_bullet.body.x = this.sys.canvas.width;
    //     enemy_bullet.body.y = this.sys.canvas.height;
    //     ship_bullet.body.x = this.sys.canvas.width;
    //     ship_bullet.body.y = this.sys.canvas.height;
    //     enemy_bullet.setActive(false);
    //     ship_bullet.setActive(false);
    // });

    // // --> enemies bullets hit AI ship's bullets
    // this.physics.add.collider(enemies_left.bullets_group, ai_ship.bullets_group, (enemy_bullet, ship_bullet) => {
    //     // hide both bullets 
    //     enemy_bullet.body.x = this.sys.canvas.width;
    //     enemy_bullet.body.y = this.sys.canvas.height;
    //     ship_bullet.body.x = this.sys.canvas.width;
    //     ship_bullet.body.y = this.sys.canvas.height;
    //     enemy_bullet.setActive(false);
    //     ship_bullet.setActive(false);
    // });
    // this.physics.add.collider(enemies_right.bullets_group, ai_ship.bullets_group, (enemy_bullet, ship_bullet) => {
    //     // hide both bullets 
    //     enemy_bullet.body.x = this.sys.canvas.width;
    //     enemy_bullet.body.y = this.sys.canvas.height;
    //     ship_bullet.body.x = this.sys.canvas.width;
    //     ship_bullet.body.y = this.sys.canvas.height;
    //     enemy_bullet.setActive(false);
    //     ship_bullet.setActive(false);
    // });

    // // --> enemies bullets hit player_ship
    // this.physics.add.collider(player_ship.sprite, enemies_left.bullets_group, (ship_sprite, bullet) => {
    //     // hide the bullet 
    //     bullet.body.x = this.sys.canvas.width;
    //     bullet.body.y = this.sys.canvas.height;
    //     bullet.setActive(false);

    //     if (ship_sprite.props.invincible) { }
    //     // kill the player. The change in behavior takes place within the update function of the ship
    //     else if (ship_sprite.props.lives > 1) {
    //         // give the player 50 frames of invincibility
    //         ship_sprite.props.invincible = true;
    //         // ship_sprite.props.invincibility_timer = 50;
    //         ship_sprite.props.invincibility_timer = frame_number;
    //         events.push({frame: frame_number, killer: 'LEFT', killed: 'PLAYER', type: 'SHOT'});
    //         this.custom_sounds.player_explosion.play();
    //         ship_sprite.props.exploding = true;
    //         ship_sprite.props.lives -= 1;
    //         ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
    //         ship_sprite.play(ship_sprite.explote_anim, true);
    //         ship_sprite.on('animationcomplete', () => {
    //             ship_sprite.x = this.sys.canvas.width / 2;
    //             ship_sprite.setTexture(ship_sprite.props.image_id);
    //             ship_sprite.props.exploding = false;
    //         });
    //     }
    //     else {
    //         events.push({frame: frame_number, killer: 'LEFT', killed: 'PLAYER', type: 'SHOT'});
    //         this.custom_sounds.player_explosion.play();
    //         ship_sprite.props.dead = true;
    //         ship_sprite.props.lives -= 1;
    //         ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
    //         player_over = true;
    //     }
    // });
    // this.physics.add.collider(player_ship.sprite, enemies_right.bullets_group, (ship_sprite, bullet) => {
    //     // hide the bullet 
    //     bullet.body.x = this.sys.canvas.width;
    //     bullet.body.y = this.sys.canvas.height;
    //     bullet.setActive(false);
    //     if (ship_sprite.props.invincible) { }
    //     // kill the player. The change in behavior takes place within the update function of the ship
    //     else if (ship_sprite.props.lives > 1) {
    //         // give the player 50 frames of invincibility
    //         ship_sprite.props.invincible = true;
    //         ship_sprite.props.invincibility_timer = frame_number;
    //         events.push({frame: frame_number, killer: 'RIGHT', killed: 'PLAYER', type: 'SHOT'});
    //         this.custom_sounds.player_explosion.play();
    //         ship_sprite.props.exploding = true;
    //         ship_sprite.props.lives -= 1;
    //         ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
    //         ship_sprite.play(ship_sprite.explote_anim, true);
    //         ship_sprite.on('animationcomplete', () => {
    //             ship_sprite.x = this.sys.canvas.width / 2;
    //             ship_sprite.setTexture(ship_sprite.props.image_id);
    //             ship_sprite.props.exploding = false;
    //         });
    //     }
    //     else {
    //         events.push({frame: frame_number, killer: 'RIGHT', killed: 'PLAYER', type: 'SHOT'});
    //         this.custom_sounds.player_explosion.play();
    //         ship_sprite.props.dead = true;
    //         ship_sprite.props.lives -= 1;
    //         ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
    //         player_over = true;
    //     }
    // });

    // // --> enemies bullets hit ai_ship
    // this.physics.add.collider(ai_ship.sprite, enemies_right.bullets_group, (ship_sprite, bullet) => {
    //     // hide the bullet 
    //     bullet.body.x = this.sys.canvas.width;
    //     bullet.body.y = this.sys.canvas.height;
    //     bullet.setActive(false);
    //     if (ship_sprite.props.invincible) { }
    //     // kill the player. The change in behavior takes place within the update function of the ship
    //     else if (ship_sprite.props.lives > 1) {
    //         // give the player 50 frames of invincibility
    //         ship_sprite.props.invincible = true;
    //         ship_sprite.props.invincibility_timer = frame_number;
    //         events.push({frame: frame_number, killer: 'RIGHT', killed: 'AI', type: 'SHOT'});
    //         this.custom_sounds.player_explosion.play();
    //         ship_sprite.props.exploding = true;
    //         ship_sprite.props.lives -= 1;
    //         ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
    //         ship_sprite.play(ship_sprite.explote_anim, true);
    //         ship_sprite.on('animationcomplete', () => {
    //             ship_sprite.x = this.sys.canvas.width / 2 + 25;
    //             ship_sprite.setTexture(ship_sprite.props.image_id);
    //             ship_sprite.props.exploding = false;
    //         });
    //     }
    //     else {
    //         events.push({frame: frame_number, killer: 'RIGHT', killed: 'AI', type: 'SHOT'});
    //         this.custom_sounds.player_explosion.play();
    //         ship_sprite.props.exploding = true;
    //         ship_sprite.play(ship_sprite.explote_anim, true);
    //         ship_sprite.on('animationcomplete', () => {
    //             ship_sprite.setTexture(ship_sprite.props.image_id);
    //             ship_sprite.props.exploding = false;
    //             ship_sprite.props.lives -= 1;
    //             ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
    //             ship_sprite.props.dead = true;
    //         });
    //         ai_over = true;
    //         //console.log("AI OVER");
    //     }
    // });
    // this.physics.add.collider(ai_ship.sprite, enemies_left.bullets_group, (ship_sprite, bullet) => {
    //     // hide the bullet 
    //     bullet.body.x = this.sys.canvas.width;
    //     bullet.body.y = this.sys.canvas.height;
    //     bullet.setActive(false);
    //     if (ship_sprite.props.invincible) { }
    //     // kill the player. The change in behavior takes place within the update function of the ship
    //     else if (ship_sprite.props.lives > 1) {
    //         // give the player 50 frames of invincibility
    //         ship_sprite.props.invincible = true;
    //         ship_sprite.props.invincibility_timer = frame_number;
    //         events.push({frame: frame_number, killer: 'LEFT', killed: 'AI', type: 'SHOT'});
    //         this.custom_sounds.player_explosion.play();
    //         ship_sprite.props.exploding = true;
    //         ship_sprite.props.lives -= 1;
    //         ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
    //         ship_sprite.play(ship_sprite.explote_anim, true);
    //         ship_sprite.on('animationcomplete', () => {
    //             ship_sprite.x = this.sys.canvas.width / 2 + 25;
    //             ship_sprite.setTexture(ship_sprite.props.image_id);
    //             ship_sprite.props.exploding = false;
    //         });
    //     }
    //     else {
    //         events.push({frame: frame_number, killer: 'LEFT', killed: 'AI', type: 'SHOT'});
    //         this.custom_sounds.player_explosion.play();
    //         ship_sprite.props.exploding = true;
    //         ship_sprite.play(ship_sprite.explote_anim, true);
    //         ship_sprite.on('animationcomplete', () => {
    //             ship_sprite.setTexture(ship_sprite.props.image_id);
    //             ship_sprite.props.exploding = false;
    //             ship_sprite.props.lives -= 1;
    //             ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
    //             ship_sprite.props.dead = true;
    //         });
    //         ai_over = true;
    //         //console.log("AI OVER");
    //     }
    // });


    // // --> enemies hit player_ship
    // this.physics.add.collider(player_ship.sprite, enemies_left.enemies_group, (ship_sprite, enemy) => {
    //     if (!enemy.hit) {
    //         // play sounds
    //         this.custom_sounds.player_explosion.play();
    //         this.custom_sounds.enemy_explosion.play();
    //         // update the score
    //         // ship_sprite.props.score += enemy.score;
    //         // ship_sprite.props.scoreText.setText("SCORE " + ship_sprite.props.score);
    //         total_score += enemy.score;
    //         score_text.setText("SCORE " + total_score);
    //         // kill the player and the enemy. The change in behavior takes place within the update function of the ship
    //         if (ship_sprite.props.lives > 1) {
    //             ship_sprite.props.exploding = true;
    //             ship_sprite.props.lives -= 1;
    //             ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
    //         }
    //         else {
    //             ship_sprite.props.dead = true;
    //             ship_sprite.props.lives -= 1;
    //             ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
    //             player_over = true;
    //         }
    //         ship_sprite.play(ship_sprite.explote_anim, true);
    //         enemy.play(enemy.explote_anim, true);
    //         ship_sprite.on('animationcomplete', () => {
    //             ship_sprite.x = this.sys.canvas.width / 2;
    //             ship_sprite.setTexture(ship_sprite.props.image_id);
    //             ship_sprite.props.exploding = false;
    //         });
    //         enemy.on('animationcomplete', () => {
    //             enemy.destroy();
    //         });
    //         enemy.hit = true;
    //         events.push({frame: frame_number, killer: 'LEFT', killed: 'PLAYER', type: 'COLLISION'});
    //         events.push({frame: frame_number, killer: 'PLAYER', killed: 'LEFT', type: 'COLLISION'});
    //     }
    // });
    // this.physics.add.collider(player_ship.sprite, enemies_right.enemies_group, (ship_sprite, enemy) => {
    //     if (!enemy.hit) {
    //         // play sound
    //         this.custom_sounds.player_explosion.play();
    //         this.custom_sounds.enemy_explosion.play();
    //         // update the score
    //         // ai_ship.sprite.props.score += enemy.score;
    //         // ai_ship.sprite.props.scoreText.setText("SCORE " + ai_ship.sprite.props.score);
    //         total_score += enemy.score;
    //         score_text.setText("SCORE " + total_score);
    //         // kill the player and the enemy. The change in behavior takes place within the update function of the ship
    //         if (ship_sprite.props.lives > 1) {
    //             ship_sprite.props.exploding = true;
    //             ship_sprite.props.lives -= 1;
    //             ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
    //         }
    //         else {
    //             ship_sprite.props.dead = true;
    //             ship_sprite.props.lives -= 1;
    //             ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
    //             player_over = true;
    //         }
    //         ship_sprite.play(ship_sprite.explote_anim, true);
    //         enemy.play(enemy.explote_anim, true);
    //         ship_sprite.on('animationcomplete', () => {
    //             ship_sprite.x = this.sys.canvas.width / 2;
    //             ship_sprite.setTexture(ship_sprite.props.image_id);
    //             ship_sprite.props.exploding = false;
    //         });
    //         enemy.on('animationcomplete', () => {
    //             enemy.destroy();
    //         });
    //         enemy.hit = true;
    //         events.push({frame: frame_number, killer: 'RIGHT', killed: 'PLAYER', type: 'COLLISION'});
    //         events.push({frame: frame_number, killer: 'PLAYER', killed: 'RIGHT', type: 'COLLISION'});
    //     }
    // });

    // // --> enemies hit ai_ship
    // this.physics.add.collider(ai_ship.sprite, enemies_left.enemies_group, (ship_sprite, enemy) => {
    //     if (!enemy.hit) {
    //         // play sounds
    //         this.custom_sounds.player_explosion.play();
    //         this.custom_sounds.enemy_explosion.play();
        
    //         // update the score
    //         // player_ship.sprite.props.score += enemy.score;
    //         // player_ship.sprite.props.scoreText.setText("SCORE " + player_ship.sprite.props.score);
    //         total_score += enemy.score;
    //         score_text.setText("SCORE " + total_score);
    //         // kill the player and the enemy. The change in behavior takes place within the update function of the ship
    //         if (ship_sprite.props.lives > 1) {
    //             ship_sprite.props.exploding = true;
    //             ship_sprite.props.lives -= 1;
    //             ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
    //         }
    //         else {
    //             ship_sprite.props.dead = true;
    //             ship_sprite.props.lives -= 1;
    //             ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
    //             ai_over = true;
    //         }
    //         ship_sprite.play(ship_sprite.explote_anim, true);
    //         enemy.play(enemy.explote_anim, true);
    //         ship_sprite.on('animationcomplete', () => {
    //             ship_sprite.x = this.sys.canvas.width / 2 + 25;
    //             ship_sprite.setTexture(ship_sprite.props.image_id);
    //             ship_sprite.props.exploding = false;
    //         });
    //         enemy.on('animationcomplete', () => {
    //             enemy.destroy();
    //         });
    //         enemy.hit = true;
    //         events.push({frame: frame_number, killer: 'LEFT', killed: 'AI', type: 'COLLISION'});
    //         events.push({frame: frame_number, killer: 'AI', killed: 'LEFT', type: 'COLLISION'});
    //     }
    // });
    // this.physics.add.collider(ai_ship.sprite, enemies_right.enemies_group, (ship_sprite, enemy) => {
    //     if (!enemy.hit) {
    //         // play sounds
    //         this.custom_sounds.player_explosion.play();
    //         this.custom_sounds.enemy_explosion.play();
        
    //         // update the score
    //         // ship_sprite.props.score += enemy.score;
    //         // ship_sprite.props.scoreText.setText("SCORE " + ship_sprite.props.score);
    //         total_score += enemy.score;
    //         score_text.setText("SCORE " + total_score);
    //         // kill the player and the enemy. The change in behavior takes place within the update function of the ship
    //         if (ship_sprite.props.lives > 1) {
    //             ship_sprite.props.exploding = true;
    //             ship_sprite.props.lives -= 1;
    //             ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
    //         }
    //         else {
    //             ship_sprite.props.dead = true;
    //             ship_sprite.props.lives -= 1;
    //             ship_sprite.lives[ship_sprite.props.lives].setVisible(false);
    //             ai_over = true;
    //         }
    //         ship_sprite.play(ship_sprite.explote_anim, true);
    //         enemy.play(enemy.explote_anim, true);
    //         ship_sprite.on('animationcomplete', () => {
    //             ship_sprite.x = this.sys.canvas.width / 2 + 25;
    //             ship_sprite.setTexture(ship_sprite.props.image_id);
    //             ship_sprite.props.exploding = false;
    //         });
    //         enemy.on('animationcomplete', () => {
    //             enemy.destroy();
    //         });
    //         enemy.hit = true;
    //         events.push({frame: frame_number, killer: 'RIGHT', killed: 'AI', type: 'COLLISION'});
    //         events.push({frame: frame_number, killer: 'AI', killed: 'RIGHT', type: 'COLLISION'});
    //     }
    // });

    var score_text = this.add.bitmapText(this.sys.canvas.width/2, 3, 'PressStart2P_Green', '', 18);
    score_text.originX = 0.5;
    score_text.setText('SCORE 0');
}