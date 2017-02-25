
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
 	},

 	create: function(slimeOptions){

        var validColors = ["yellow","red","blue","green","purple","black"];

        var randomizeSlime = function() {
            return validColors[this.game.Math.between(0,(validColors.length - 1))];
        }

        if (typeof(slimeOptions.color) == "undefined" || validColors.indexOf(slimeOptions.color) == -1){
            slimeOptions.color = randomizeGem();
        }
        slimeOptions.name = slimeOptions.color + "Slime";
        slimeOptions.spriteName = slimeOptions.color + "Slime";

 		slimeOptions.allowGravity = true;
        slimeOptions.speed = slimeOptions.speed || 100;

        var slimeUpdate = function(){
            this.body.velocity.x *= 0.95;

            if(this.x >= (this.toybox.game.width - 8) || this.x <= 8){
                this.turnAround();
            }

            if(this.timeToMove){
                this.animations.play("idle");
                this.timeToMove = false;

                this.body.velocity.x = (-1 * this.speed * this.scale.x);
                var thisSlime = this;
                this.toybox.game.time.events.add(500, function(){ thisSlime.timeToMove = true; }, this);
            }

        };

        slimeOptions.update = slimeUpdate;

        var slimeCollide = function(slime, collidedSprite){
            var isFromTop = (collidedSprite.y + collidedSprite.height / 2) < (slime.y + 4);

            if (isFromTop){
                if (this.spriteIsPlayer(collidedSprite)){
                    collidedSprite.body.velocity.y = -200;
                    slime.kill();
                }
                
            } else {
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
            this.canTurnAround = false;
            var thisSlime = this;
            this.toybox.game.time.events.add(500, function(){ thisSlime.canTurnAround = true; }, this);
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

        return slimeGO;
 	}
     
};