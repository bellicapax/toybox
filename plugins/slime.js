
var slimeToyboxPlugin = {
 	name: "slime",
    toyboxType: "mob",

 	preload: function(toyboxObject){
 		toyboxObject._game.load.spritesheet("greenSlime", "../../assets/sprites/greenSlimeSheet.png", 16, 8);
        toyboxObject._game.load.spritesheet("redSlime", "../../assets/sprites/redSlimeSheet.png", 16, 8);
        toyboxObject._game.load.spritesheet("blueSlime", "../../assets/sprites/blueSlimeSheet.png", 16, 8);
        toyboxObject._game.load.spritesheet("yellowSlime", "../../assets/sprites/yellowSlimeSheet.png", 16, 8);
        toyboxObject._game.load.spritesheet("purpleSlime", "../../assets/sprites/purpleSlimeSheet.png", 16, 8);
        toyboxObject._game.load.spritesheet("blackSlime", "../../assets/sprites/blackSlimeSheet.png", 16, 8);
        toyboxObject._game.load.audio("slimeBump", "../../assets/sfx/goo-2.wav");
        toyboxObject._game.load.audio("slimeDie", "../../assets/sfx/goo-1.wav");
 	},

    sfx: ["slimeBump","slimeDie"],

 	create: function(slimeOptions){

        var validColors = ["yellow","red","blue","green","purple","black"];

        var randomizeSlime = function() {
            return validColors[Phaser.Math.between(0,(validColors.length - 1))];
        }

        if (typeof(slimeOptions.color) == "undefined" || validColors.indexOf(slimeOptions.color) == -1){
            slimeOptions.color = randomizeSlime();
        }
        slimeOptions.name = slimeOptions.color + "Slime";
        slimeOptions.spriteName = slimeOptions.color + "Slime";

 		slimeOptions.allowGravity = true;
        slimeOptions.speed = slimeOptions.speed || 100;

        var slimeUpdate = function(){
            if (this.body !== null){
                this.body.velocity.x *= 0.95;
            }

            if( this.x >= (this.toybox.game.width - (Math.abs(this.width) / 2) ) || (this.x <= (Math.abs(this.width) / 2) ) ){
                this.turnAround();
            }

            if(this.timeToMove && !this.isHit && (this.body.onFloor() || this.body.touching.down)){
                this.animations.play("idle");
                this.timeToMove = false;

                this.body.velocity.x = (-1 * this.speed * this.scale.x);
                var thisSlime = this;
                this.toybox.game.time.events.add(500, function(){ thisSlime.timeToMove = true; }, this);
            }

        };

        slimeOptions.update = slimeUpdate;

        var slimeCollide = function(slime, collidedSprite){
            var horizDis = collidedSprite.x - slime.x;
            var isBlocked = ((horizDis < 0 && slime.scale.x > 0) || (horizDis > 0 && slime.scale.x < 0));
            var slimeIsAbove = (slime.y + slime.height / 2) <= (collidedSprite.y - collidedSprite.height / 2);
            if (isBlocked && !slimeIsAbove) {
                slime.turnAround();
            }

        }

        slimeOptions.collide = slimeCollide;

        var slimeGO = this.toybox.add.mob(slimeOptions);

        slimeGO.turnAround = function(){
            if (!this.canTurnAround){
                return;
            }
            this.scale.x *= -1;
            this.toybox.sfx.slimeBump.play();
            this.canTurnAround = false;
            var thisSlime = this;
            this.toybox.game.time.events.add(500, function(){ thisSlime.canTurnAround = true; }, this);
        }

        slimeGO.hit = function(){
            if (this.isHit){
                return;
            }
            this.isHit = true;
            this.health -= 1;
            this.animations.play("dead");
            this.height = 3;
            this.toybox.sfx.slimeDie.play();
            var thisSlime = this;
            this.toybox.game.time.events.add(500, function(){ 
                if (thisSlime.health <= 0){
                    thisSlime.kill();
                } else {
                    thisSlime.animations.play("idle");
                    thisSlime.isHit = false; 
                }
            }, this);
        }

        var fps = this.toybox.animationFPS;
        slimeGO.animations.add("dead", [2]);
        slimeGO.animations.add("idle", [0, 1], fps, true);

        switch (slimeOptions.color){
            case "yellow":
                slimeGO.speed = 233;
            break;
            case "purple":
                slimeGO.speed = 200;
            break;
            case "black":
                slimeGO.speed = 166;
            break;
            case "red":
                slimeGO.speed = 133;
            break;
            case "blue":
                slimeGO.speed = 100;
            break;
            case "green":
            default:
                slimeGO.speed = 66;
            break;
        }

        slimeGO.timeToMove = true;
        slimeGO.canTurnAround = true;
        slimeGO.isHit = false;
        slimeGO.scale.x = (slimeOptions.facing == "right") ? -1 : 1 ;

        return slimeGO;
 	}
     
};