// Alien is a player object made for basic platformer-style games.
// It has three controls: left, right, and jump

// playerOptions attributes:
//     startingX: number, initial X location for sprite's center
//     startingY: number, initial Y location for sprite's center
//     scale: number, the size of the sprite as a multiple
//     facing: string ("left" or "right") determines the direction the sprite starts out facing.
//     speed: number, represents the speed the player will move when activated
//     jumpForce: number, represents how hard a player will jump
//     controls: object, contains key-value pairs of keycodes and named controls
//
// unique alienOptions attributes:
//      color: string, valid options: "green" "blue" "pink"
//      controls: object, needs to contains keycodes for left,right,jump


var alienAstronautToyboxPlugin = {
    name: "alienAstronaut",
    toyboxType: "player",

    preload: function (toyboxObject) {
        toyboxObject._game.load.spritesheet("greenAlien", "../../assets/sprites/greenAlienSheet.png", 16, 20);
        toyboxObject._game.load.spritesheet("blueAlien", "../../assets/sprites/blueAlienSheet.png", 16, 20);
        toyboxObject._game.load.spritesheet("pinkAlien", "../../assets/sprites/pinkAlienSheet.png", 16, 20);
        toyboxObject._game.load.spritesheet("heartsAndStar", "../../assets/sprites/heartsAndStarSheet.png", 16, 16);
        toyboxObject._game.load.audio("alienJump", "../../assets/sfx/jump-2.wav");
        toyboxObject._game.load.audio("alienHit", "../../assets/sfx/chirp-3.wav");
        toyboxObject._game.load.audio("alienKill", "../../assets/sfx/zap-1.wav");

    },

    sfx: ["alienJump", "alienHit", "alienKill"],

    create: function (alienOptions) {
        alienOptions = typeof (alienOptions) == "undefined" ? {} : alienOptions;

        const JOYSTICK_THRESHOLD = 0.15;
        var leftStickX = Phaser.Gamepad.XBOX360_STICK_LEFT_X;
        var leftStickY = Phaser.Gamepad.XBOX360_STICK_LEFT_Y;
        var rightStickX = Phaser.Gamepad.XBOX360_STICK_RIGHT_X;
        var rightStickY = Phaser.Gamepad.XBOX360_STICK_RIGHT_Y;
        var accelAxis = Phaser.Gamepad.XBOX360_RIGHT_TRIGGER;
        var decelAxis = Phaser.Gamepad.XBOX360_LEFT_TRIGGER;
        alienOptions.allowGravity = false;
        alienOptions.speed = alienOptions.turnSpeed || 275;
        alienOptions.flyForce = alienOptions.flyForce || 1.5;
        alienOptions.health = alienOptions.health || 3;
        var validColors = ["green", "blue", "pink"];
        alienOptions.health = alienOptions.health || 3;
        if (typeof (alienOptions.color) == "undefined" || validColors.indexOf(alienOptions.color) == -1) {
            alienOptions.color = "green";
        }
        if (typeof (alienOptions.controls) == "undefined") {
            alienOptions.controls = {
                left: 65,
                right: 68,
                up: 87,
                down: 83
            }
        };
        alienOptions.spriteName = alienOptions.color + "Alien";
        var updateAlienAstronaut = function () {
            if (this.isHit) {
                return;
            }

            if (this.health <= 0) {
                this.kill();
                return;
            }
            var pad = this.controls.pad;
            var padInput = {
          		leftX: pad.axis(leftStickX),
          		leftY: pad.axis(leftStickY),
          		rightX: pad.axis(rightStickX),
          		rightY: pad.axis(rightStickY),
          		accel: pad.buttonValue(accelAxis),
          		decel: pad.buttonValue(decelAxis),
          		blow: pad.isDown(blowButton)
          	};
            this.body.angularVelocity = 0;
            if (this.controls.right.isDown || padInput.leftX > JOYSTICK_THRESHOLD) {
                var modifier = this.controls.right.isDown ? 1 : padInput.leftX;
                this.body.angularVelocity = this.speed * modifier;
                if (this.animations.name !== "run") {
                    this.animations.play("run");
                }
            } else if (this.controls.left.isDown || padInput.leftX < -JOYSTICK_THRESHOLD) {
                var modifier = this.controls.left.isDown ? 1 : Math.abs(padInput.leftX);
                this.body.angularVelocity = -this.speed * modifier;
                if (this.animations.name !== "run") {
                    this.animations.play("run");
                }
            }

            // checkForBoost
            var angularspeed = new Phaser.Point();
            if (this.controls.up.isDown || padInput.accel > JOYSTICK_THRESHOLD) {
                this.toybox.game.physics.arcade.velocityFromAngle(this.angle + 90, this.flyForce, angularspeed);
                var modifier = this.controls.up.isDown ? 1 : padInput.accel;
                this.body.velocity.x -= angularspeed.x * modifier;
                this.body.velocity.y -= angularspeed.y * modifier;
                if (this.animations.name !== "jump") {
                    this.animations.play("jump");
                }
            } else if (this.controls.down.isDown || padInput.decel > JOYSTICK_THRESHOLD) {
                this.toybox.game.physics.arcade.velocityFromAngle(this.angle + 90, this.flyForce, angularspeed);
                var modifier = this.controls.down.isDown ? 1 : padInput.decel;
                this.body.velocity.x += angularspeed.x * modifier;
                this.body.velocity.y += angularspeed.y * modifier;
                if (this.animations.name !== "jump") {
                    this.animations.play("jump");
                }
            }
            // var pointer = this.toybox.game.input.activePointer;
            // setMidAngle(this, pointer);
            // calculateTriangle(this);
            // var shouldBlow = pointer.isDown || padInput.blow;
            //
            // var usingGamepad = this.toybox.game.input.gamepad.padsConnected > 0;
            //
            // drawTriangle(this.graphics, shouldBlow);
            // if (shouldBlow) {
            //     var floatiesToBlow = getFloatiesToBlow(this);
            //     if (usingGamepad) {
            //         if (Math.abs(padInput.rightX) > JOYSTICK_THRESHOLD || Math.abs(padInput.rightY)) {
            //             this.normalizedDir = new Phaser.Point(padInput.rightX, padInput.rightY).normalize()
            //         }
            //     } else {
            //         this.normalizedDir = new Phaser.Point(pointer.x - this.x, pointer.y - this.y).normalize();
            //     }
            //     blowFloaties(floatiesToBlow, this, this.normalizedDir);
            // }

        };

        alienOptions.update = typeof (alienOptions.update) != "function" ? updateAlienAstronaut : alienOptions.update;

        var alienCollide = function (alien, collidedSprite) {
            var alienIsOnTop = (alien.y + (alien.height / 2)) <= (collidedSprite.y - collidedSprite.height / 2);

            if (collidedSprite.isMob()) {
                if (alienIsOnTop) {
                    alien.body.velocity.y = -200;
                    collidedSprite.hit();
                } else {
                    if (collidedSprite.health > 0) {
                        alien.hit();
                    }
                }
            }
        };

        alienOptions.collide = alienCollide;

        var alienKill = function (alien) {
            var splosion = this.toybox.game.add.emitter(alien.x, alien.y, 12);
            this.toybox.topDecorations.add(splosion);
            splosion.makeParticles('heartsAndStar', [5]);
            splosion.gravity = 0;
            splosion.minParticleSpeed = new Phaser.Point(-400, -400);
            splosion.maxParticleSpeed = new Phaser.Point(400, 400);
            this.toybox.sfx.alienKill.play();
            splosion.start(true, 4000, null, 12);
            this.toybox.players.remove(this);
            game.time.events.add(2000, function () {
                splosion.kill()
            }, this);

        }

        alienOptions.kill = alienKill;

        var alienGO = this.toybox.add.player(alienOptions);

        alienGO.flyForce = alienOptions.flyForce;
        alienGO.health = alienOptions.health;
        alienGO.events.onHit = new Phaser.Signal();
        if (typeof (alienOptions.onHit) == "function") {
            alienGO.events.onHit.add(alienOptions.onHit);
        }

        alienGO.hit = function () {
            if (this.isHit) {
                return;
            }
            this.isHit = true;
            this.health -= 1;
            this.body.velocity.x = -75 * this.scale.x;
            this.body.velocity.y = -200;
            for (var i = this.children.length - 1; i >= 0; i--) {
                this.children[i].drop();
            }
            this.animations.play("hit");
            this.toybox.sfx.alienHit.play();
            this.events.onHit.dispatch(this);
            var thisAlien = this;
            this.toybox.game.time.events.add(500, function () {
                if (thisAlien.health <= 0) {
                    thisAlien.kill();
                } else {
                    thisAlien.animations.play("idle");
                    thisAlien.isHit = false;
                }
            }, this);
        }

        var fps = this.toybox.animationFPS;
        alienGO.animations.add("idle", [1]);
        alienGO.animations.add("hit", [4]);
        alienGO.animations.add("run", [9, 10], fps, true);
        alienGO.animations.add("jump", [7, 8], fps, true);

        alienGO.isHit = false;
        alienGO.scale.x *= (alienOptions.facing == "right") ? 1 : -1;

        return alienGO;
    }

};
