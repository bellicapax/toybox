
var jellyToyboxPlugin = {
 	name: "jelly",
    toyboxType: "mob",

 	preload: function(toyboxObject){
 		toyboxObject._game.load.spritesheet("jelly", "../../assets/sprites/jellySheet.png", 16, 16);
        toyboxObject._game.load.audio("jellyBump", "../../assets/sfx/goo-2.wav");
        toyboxObject._game.load.audio("jellyDie", "../../assets/sfx/goo-1.wav");
 	},

    sfx: ["jellyBump","jellyDie"],

 	create: function(jellyOptions){
    jellyOptions = typeof (jellyOptions) == "undefined" ? {} : jellyOptions;

        jellyOptions.name = "jelly";
        jellyOptions.spriteName = "jelly";

 		jellyOptions.allowGravity = true;
        jellyOptions.speed = jellyOptions.speed || 200;

        var jellyUpdate = function(){
            if (this.body == null){
               return;
            }

            this.body.velocity.x *= 0.95;

            if(this.timeToMove && !this.isHit && (this.body.onFloor() || this.body.touching.down)){
                this.toybox.sfx.jellyBump.play();
                this.animations.play("idle");
                this.timeToMove = false;

                this.body.velocity.x = (this.speed * this.xDir);
                this.body.velocity.y = (this.speed * -1);
                var thisJelly = this;
                this.toybox.game.time.events.add(1000, function(){ thisJelly.timeToMove = true; }, this);
            }

            if (this.state == "calm"){

                if( this.x >= (this.toybox.game.width - (Math.abs(this.width) / 2) ) || (this.x <= (Math.abs(this.width) / 2) ) ){
                    this.turnAround();
                }

            } else if (this.state == "mad"){

                if (this.animations.name == "idle") {
                    this.animations.play("mad");
                }

                var targetPlayer = this.toybox.players.children[0];

                for (var i = this.toybox.players.children.length - 1; i >= 0; i--) {
                    var newPlayer = this.toybox.players.children[i];
                    var targetDist = Math.sqrt((Math.abs(this.y - targetPlayer.y))^2 + (Math.abs(this.x - targetPlayer.x))^2);
                    var newDist = Math.sqrt((Math.abs(this.y - newPlayer.y))^2 + (Math.abs(this.x - newPlayer.x))^2);
                    if( newDist < targetDist ){
                        targetPlayer = newPlayer;
                    }
                }

                if( (targetPlayer.x < this.x && this.xDir == 1) || (targetPlayer.x > this.x && this.xDir == -1) ){
                    this.turnAround();
                }
            }

        };

        jellyOptions.update = jellyUpdate;

        var jellyCollide = function(jelly, collidedSprite){
            if (jelly.state == "calm"){
                var horizDis = collidedSprite.x - jelly.x;
                var isBlocked = ((horizDis < 0 && jelly.xDir == -1) || (horizDis > 0 && jelly.xDir == 1));
                var jellyIsAbove = (jelly.y + jelly.height / 2) <= (collidedSprite.y - collidedSprite.height / 2);
                if (isBlocked && !jellyIsAbove) {
                    jelly.turnAround();
                }
            }

        }

        jellyOptions.collide = jellyCollide;

        var jellyKill = function(jelly){
            if (typeof(this.toybox.loadedPlugins.slime) !== "undefined"){
                var slime1 = this.toybox.add.slime({startingX: jelly.x - 4, startingY: jelly.y, color: "green"});
                slime1.body.velocity = new Phaser.Point(-100,100);
                var slime2 = this.toybox.add.slime({startingX: jelly.x + 4, startingY: jelly.y, color: "green"});
                slime2.body.velocity = new Phaser.Point(100,100);
                var slime3 = this.toybox.add.slime({startingX: jelly.x, startingY: jelly.y - 4, color: "green"});
                slime3.body.velocity = new Phaser.Point(0,100);
            }
        }

        jellyOptions.kill = jellyKill;

        var jellyGO = this.toybox.add.mob(jellyOptions);

        jellyGO.turnAround = function(){
            if (!this.canTurnAround){
                return;
            }
            this.xDir *= -1;
            this.canTurnAround = false;
            var thisJelly = this;
            this.toybox.game.time.events.add(1500, function(){ thisJelly.canTurnAround = true; }, this);
        }

        jellyGO.hit = function(){
            if (this.isHit){
                return;
            }
            this.isHit = true;
            this.health -= 1;

            this.toybox.sfx.jellyDie.play();
            var thisJelly = this;
            if (thisJelly.health <= 0){
                this.animations.play("die");
                this.toybox.game.time.events.add(1500, function(){ thisJelly.kill(); }, this);
            } else {
                thisJelly.animations.play("hit");
                this.toybox.game.time.events.add(1500, function(){
                    thisJelly.isHit = false;
                    thisJelly.state = "mad";
                }, this);

            }
        }

        var fps = this.toybox.animationFPS / 2;
        jellyGO.animations.add("die", [0, 0, 6, 6]);
        jellyGO.animations.add("hit", [0, 0, 4, 4]);
        jellyGO.animations.add("mad", [5], fps, true);
        jellyGO.animations.add("idle", [1, 2, 3], fps, true);

        jellyGO.timeToMove = true;
        jellyGO.canTurnAround = true;
        jellyGO.isHit = false;
        jellyGO.health = 3;
        jellyGO.state = "calm";
        jellyGO.xDir = (jellyOptions.facing == "right") ? -1 : 1 ;

        return jellyGO;
 	}

};
