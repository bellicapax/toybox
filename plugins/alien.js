
var alienToyboxPlugin = {
 	name: "alien",
    toyboxType: "player",

 	preload: function(toyboxObject){
 		toyboxObject._game.load.spritesheet("greenAlien", "../../assets/sprites/greenAlienSheet.png", 16, 20);
        toyboxObject._game.load.spritesheet("blueAlien", "../../assets/sprites/blueAlienSheet.png", 16, 20);
        toyboxObject._game.load.spritesheet("pinkAlien", "../../assets/sprites/pinkAlienSheet.png", 16, 20);
        toyboxObject._game.load.spritesheet("heartsAndStar", "../../assets/sprites/heartsAndStarSheet.png", 16, 16);
        toyboxObject._game.load.audio("alienJump", "../../assets/sfx/jump-2.wav");
        toyboxObject._game.load.audio("alienHit", "../../assets/sfx/chirp-3.wav");
        toyboxObject._game.load.audio("alienKill", "../../assets/sfx/zap-1.wav");

 	},

    sfx: ["alienJump","alienHit","alienKill"],

 	create: function(alienOptions){
 		alienOptions.allowGravity = true;
        var validColors = ["green","blue","pink"];
        alienOptions.speed = alienOptions.speed || 100;
        alienOptions.jumpForce = alienOptions.jumpForce || 300;
        alienOptions.health = alienOptions.health || 3;
        if (typeof(alienOptions.color) == "undefined" || validColors.indexOf(alienOptions.color) == -1){
            alienOptions.color = "green";
        }
        if (typeof(alienOptions.controls) == "undefined"){
            alienOptions.controls = {
                left: 37,
                right: 39,
                jump: 38
            }
        };
        alienOptions.spriteName = alienOptions.color + "Alien";

        var alienPlatformerUpdate = function(){
            if (this.isHit || this.health <= 0){
                return;
            }
        	if (this.controls.right.isDown) {
        	    this.body.velocity.x = this.speed;
        	    if (this.scale.x < 0) {
        	        this.scale.x *= -1;
        	    }
        	    if (this.animations.name !== "run") {
        	        this.animations.play("run");
        	    }
        	} else if (this.controls.left.isDown) {
        	    this.body.velocity.x = -this.speed;
        	    if (this.scale.x > 0) {
        	        this.scale.x *= -1;
        	    }
        	    if (this.animations.name !== "run") {
        	        this.animations.play("run");
        	    }
        	} else {
        	    // Not moving
        	    this.body.velocity.x = 0;
        	    this.animations.play("idle");
        	}

        	// checkForJump
        	if (this.controls.jump.isDown && (this.body.onFloor() || this.body.touching.down)) {
        	    this.body.velocity.y = -this.jumpForce;
        	    if (this.animations.name !== "jump") {
        	        this.animations.play("jump");
                    this.toybox.sfx.alienJump.play();
        	    }
        	}
        };

        alienOptions.update = alienPlatformerUpdate;

        var alienCollide = function(alien, collidedSprite){
            var alienIsOnTop = (alien.y + (alien.height / 2)) <= (collidedSprite.y - collidedSprite.height / 2) ;

            if (collidedSprite.isMob()){
                if (alienIsOnTop){
                    alien.body.velocity.y = -200;
                    collidedSprite.hit();
                } else {
                    alien.hit();
                }
            }
        };

        alienOptions.collide = alienCollide;

        var alienKill = function(alien){
            var splosion = this.toybox.game.add.emitter(alien.x, alien.y, 12);
            this.toybox.topDecorations.add(splosion);
            splosion.makeParticles('heartsAndStar',[5]);
            splosion.gravity = 0;
            splosion.minParticleSpeed = new Phaser.Point(-400,-400);
            splosion.maxParticleSpeed = new Phaser.Point(400,400);
            this.toybox.sfx.alienKill.play();
            splosion.start(true,4000,null,12);
            this.toybox.players.remove(this);
            game.time.events.add(2000, function(){ splosion.kill()}, this);

        }

        alienOptions.kill = alienKill;

        var alienGO = this.toybox.add.player(alienOptions);

        alienGO.health = alienOptions.health;

        alienGO.hit = function(){
            if (this.isHit){
                return;
            }
            this.isHit = true;
            this.health -= 1;
            this.body.velocity.x = -75 * this.scale.x;
            this.body.velocity.y = -200;
            this.animations.play("hit");
            this.toybox.sfx.alienHit.play();
            var thisAlien = this;
            this.toybox.game.time.events.add(500, function(){
                if (thisAlien.health <= 0){
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
        alienGO.scale.x *= (alienOptions.facing == "right") ? 1 : -1 ;

        return alienGO;
 	}

};
