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

    preload: function(toyboxObject) {
        toyboxObject._game.load.spritesheet("greenAlien", "../../assets/sprites/greenAlienSheet.png", 16, 20);
        toyboxObject._game.load.spritesheet("blueAlien", "../../assets/sprites/blueAlienSheet.png", 16, 20);
        toyboxObject._game.load.spritesheet("pinkAlien", "../../assets/sprites/pinkAlienSheet.png", 16, 20);
        toyboxObject._game.load.spritesheet("heartsAndStar", "../../assets/sprites/heartsAndStarSheet.png", 16, 16);
        toyboxObject._game.load.audio("alienJump", "../../assets/sfx/jump-2.wav");
        toyboxObject._game.load.audio("alienHit", "../../assets/sfx/chirp-3.wav");
        toyboxObject._game.load.audio("alienKill", "../../assets/sfx/zap-1.wav");

    },

    sfx: ["alienJump", "alienHit", "alienKill"],

    create: function(alienOptions) {
        alienOptions = typeof(alienOptions) == "undefined" ? {} : alienOptions;
        const halfAngle = Phaser.Math.degToRad(15);
        const JOYSTICK_THRESHOLD = 0.15;
        var leftStickX = Phaser.Gamepad.XBOX360_STICK_LEFT_X;
        var leftStickY = Phaser.Gamepad.XBOX360_STICK_LEFT_Y;
        var rightStickX = Phaser.Gamepad.XBOX360_STICK_RIGHT_X;
        var rightStickY = Phaser.Gamepad.XBOX360_STICK_RIGHT_Y;
        var accelAxis = Phaser.Gamepad.XBOX360_RIGHT_TRIGGER;
        var decelAxis = Phaser.Gamepad.XBOX360_LEFT_TRIGGER;
        var blowButton = Phaser.Gamepad.XBOX360_RIGHT_BUMPER;
        var blowerReach = 120;
        var hypOverAdj = (1 / Math.cos(halfAngle));
        var adjacent = blowerReach;
        var hypotenuse = hypOverAdj * adjacent;

        alienOptions.allowGravity = false;
        alienOptions.speed = alienOptions.turnSpeed || 275;
        alienOptions.flyForce = alienOptions.flyForce || 1.5;
        alienOptions.health = alienOptions.health || 3;
        var validColors = ["green", "blue", "pink"];
        alienOptions.health = alienOptions.health || 3;
        if (typeof(alienOptions.color) == "undefined" || validColors.indexOf(alienOptions.color) == -1) {
            alienOptions.color = "green";
        }
        if (typeof(alienOptions.controls) == "undefined") {
            alienOptions.controls = {
                left: 65,
                right: 68,
                up: 87,
                down: 83
            }
        };
        alienOptions.spriteName = alienOptions.color + "Alien";

        var updateAlienAstronaut = function() {
            if (this.isHit) {
                return;
            }

            if (this.health <= 0) {
                this.kill();
                return;
            }
            var padInput = getPadInput(this.controls.pad);
            updateAlienMovement(this, padInput);
            updatePlayerFan(this, padInput);
        };

        var getPadInput = function(pad) {
            return {
                leftX: pad.axis(leftStickX),
                leftY: pad.axis(leftStickY),
                rightX: pad.axis(rightStickX),
                rightY: pad.axis(rightStickY),
                accel: pad.buttonValue(accelAxis),
                decel: pad.buttonValue(decelAxis),
                blow: pad.isDown(blowButton)
            };
        };

        var updateAlienMovement = function(player, padInput) {
            player.body.angularVelocity = 0;
            if (player.controls.right.isDown || padInput.leftX > JOYSTICK_THRESHOLD) {
                var modifier = player.controls.right.isDown ? 1 : padInput.leftX;
                player.body.angularVelocity = player.speed * modifier;
                if (player.animations.name !== "run") {
                    player.animations.play("run");
                }
            }
            else if (player.controls.left.isDown || padInput.leftX < -JOYSTICK_THRESHOLD) {
                var modifier = player.controls.left.isDown ? 1 : Math.abs(padInput.leftX);
                player.body.angularVelocity = -player.speed * modifier;
                if (player.animations.name !== "run") {
                    player.animations.play("run");
                }
            }

            // checkForBoost
            var angularspeed = new Phaser.Point();
            if (player.controls.up.isDown || padInput.accel > JOYSTICK_THRESHOLD) {
                player.toybox.game.physics.arcade.velocityFromAngle(player.angle + 90, player.flyForce, angularspeed);
                var modifier = player.controls.up.isDown ? 1 : padInput.accel;
                player.body.velocity.x -= angularspeed.x * modifier;
                player.body.velocity.y -= angularspeed.y * modifier;
                if (player.animations.name !== "jump") {
                    player.animations.play("jump");
                }
            }
            else if (player.controls.down.isDown || padInput.decel > JOYSTICK_THRESHOLD) {
                player.toybox.game.physics.arcade.velocityFromAngle(player.angle + 90, player.flyForce, angularspeed);
                var modifier = player.controls.down.isDown ? 1 : padInput.decel;
                player.body.velocity.x += angularspeed.x * modifier;
                player.body.velocity.y += angularspeed.y * modifier;
                if (player.animations.name !== "jump") {
                    player.animations.play("jump");
                }
            }
        };

        var updatePlayerFan = function(player, padInput) {
            var usingGamepad = player.toybox.game.input.gamepad.padsConnected > 0;
            var pointer = player.toybox.game.input.activePointer;
            var midAngle = getMidAngle(player, pointer, usingGamepad);
            var triangle = calculateTriangle(midAngle, player);
            var shouldBlow = pointer.isDown || padInput.blow;
            drawTriangle(triangle, player.graphics, shouldBlow);
            tryBlowSprites(player, padInput, pointer, usingGamepad, triangle, shouldBlow);
        };

        var getMidAngle = function(player, pointer, usingGamepad) {
            var midAngle;
            if (usingGamepad) {
                var xAxis = player.controls.pad.axis(rightStickX);
                var yAxis = player.controls.pad.axis(rightStickY);
                if (Math.abs(xAxis) > JOYSTICK_THRESHOLD || Math.abs(yAxis) > JOYSTICK_THRESHOLD) {
                    midAngle = Math.atan2(yAxis, xAxis);
                }
            }
            else {
                midAngle = Phaser.Math.angleBetween(player.x, player.y, pointer.x, pointer.y);
            }
            return midAngle;
        }

        var calculateTriangle = function(midAngle, sprite) {
            var angleToLeft = midAngle + halfAngle;
            var angleToRight = midAngle - halfAngle;
            var leftDirection = new Phaser.Point(Math.cos(angleToLeft), Math.sin(angleToLeft));
            var rightDirection = new Phaser.Point(Math.cos(angleToRight), Math.sin(angleToRight));
            var leftPoint = new Phaser.Point(sprite.x + leftDirection.x * hypotenuse, sprite.y + leftDirection.y * hypotenuse);
            var rightPoint = new Phaser.Point(sprite.x + rightDirection.x * hypotenuse, sprite.y + rightDirection.y * hypotenuse);
            return {
                a: new Phaser.Point(sprite.x, sprite.y),
                b: leftPoint,
                c: rightPoint
            };
        };

        var drawTriangle = function(triangle, graphics, shouldFill) {
            graphics.clear();
            graphics.lineStyle(1, 0xffffff, 1);
            if (shouldFill) {
                graphics.fillAlpha = 0.5;
                graphics.beginFill(0xffffff);
            }
            graphics.moveTo(triangle.a.x, triangle.a.y);
            graphics.lineTo(triangle.b.x, triangle.b.y);
            graphics.lineTo(triangle.c.x, triangle.c.y);
            graphics.lineTo(triangle.a.x, triangle.a.y);
        };

        var tryBlowSprites = function(player, padInput, pointer, usingGamepad, triangle, shouldBlow) {
            if (shouldBlow) {
                var spritesToBlow = getSpritesToBlow(triangle, player);
                if (usingGamepad) {
                    if (Math.abs(padInput.rightX) > JOYSTICK_THRESHOLD || Math.abs(padInput.rightY)) {
                        player.normalizedDir = new Phaser.Point(padInput.rightX, padInput.rightY).normalize()
                    }
                }
                else {
                    player.normalizedDir = new Phaser.Point(pointer.x - player.x, pointer.y - player.y).normalize();
                }
                blowSprites(spritesToBlow, player, player.normalizedDir);
            }
        }

        var getSpritesToBlow = function(triangle, player) {
            var spritesToBlow = [];
            for (var i = 0; i < floaties.length; i++) {
                if (pointIsInTriangle(floaties[i].x, floaties[i].y, triangle)) {
                    spritesToBlow.push(floaties[i]);
                }
            }
            return spritesToBlow;
        }

        var blowSprites = function(spritesToBlow, sprite, normalizedDir) {
            for (var i = 0; i < spritesToBlow.length; i++) {
                var dist = Phaser.Math.distance(sprite.x, sprite.y, spritesToBlow[i].x, spritesToBlow[i].y);
                var distanceModifier = Phaser.Math.linear(1, 0.1, dist / hypotenuse);
                spritesToBlow[i].body.velocity.x += normalizedDir.x * blowStrength * distanceModifier;
                spritesToBlow[i].body.velocity.y += normalizedDir.y * blowStrength * distanceModifier;
            }
        }

        alienOptions.update = typeof(alienOptions.update) != "function" ? updateAlienAstronaut : alienOptions.update;

        var alienCollide = function(alien, collidedSprite) {
            var alienIsOnTop = (alien.y + (alien.height / 2)) <= (collidedSprite.y - collidedSprite.height / 2);

            if (collidedSprite.isMob()) {
                if (alienIsOnTop) {
                    alien.body.velocity.y = -200;
                    collidedSprite.hit();
                }
                else {
                    if (collidedSprite.health > 0) {
                        alien.hit();
                    }
                }
            }
        };

        alienOptions.collide = alienCollide;

        var alienKill = function(alien) {
            var splosion = this.toybox.game.add.emitter(alien.x, alien.y, 12);
            this.toybox.topDecorations.add(splosion);
            splosion.makeParticles('heartsAndStar', [5]);
            splosion.gravity = 0;
            splosion.minParticleSpeed = new Phaser.Point(-400, -400);
            splosion.maxParticleSpeed = new Phaser.Point(400, 400);
            this.toybox.sfx.alienKill.play();
            splosion.start(true, 4000, null, 12);
            this.toybox.players.remove(this);
            game.time.events.add(2000, function() {
                splosion.kill()
            }, this);

        }

        alienOptions.kill = alienKill;

        var alienGO = this.toybox.add.player(alienOptions);

        alienGO.flyForce = alienOptions.flyForce;
        alienGO.health = alienOptions.health;
        alienGO.events.onHit = new Phaser.Signal();
        alienGO.controls.pad = alienOptions.pad || this.toybox.game.input.gamepad.pad1;
        if (typeof(alienOptions.onHit) == "function") {
            alienGO.events.onHit.add(alienOptions.onHit);
        }

        alienGO.hit = function() {
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
            this.toybox.game.time.events.add(500, function() {
                if (thisAlien.health <= 0) {
                    thisAlien.kill();
                }
                else {
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
