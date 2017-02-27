
var flyToyboxPlugin = {
 	name: "fly",
    toyboxType: "mob",

 	preload: function(toyboxObject){
        toyboxObject._game.load.spritesheet("redFly", "../../assets/sprites/redFlySheet.png", 16, 16);
        toyboxObject._game.load.spritesheet("blueFly", "../../assets/sprites/blueFlySheet.png", 16, 16);
        toyboxObject._game.load.spritesheet("yellowFly", "../../assets/sprites/yellowFlySheet.png", 16, 16);
        toyboxObject._game.load.spritesheet("blackFly", "../../assets/sprites/blackFlySheet.png", 16, 16);
        toyboxObject._game.load.audio("flyTurn", "../../assets/sfx/chirp-4.wav");
        toyboxObject._game.load.audio("flyDie", "../../assets/sfx/falling-1.wav");
 	},

    sfx: ["flyTurn","flyDie"],

 	create: function(flyOptions){

        var validColors = ["yellow","red","blue","black"];

        var randomizeFly = function() {
            return validColors[Phaser.Math.between(0,(validColors.length - 1))];
        }

        if (typeof(flyOptions.color) == "undefined" || validColors.indexOf(flyOptions.color) == -1){
            flyOptions.color = randomizeFly();
        }
        flyOptions.name = flyOptions.color + "Fly";
        flyOptions.spriteName = flyOptions.color + "Fly";

 		flyOptions.allowGravity = false;

        switch (flyOptions.color){
            case "yellow":
                flyOptions.speed = 25;
            break;
            case "black":
                flyOptions.speed = 75;
            break;
            case "red":
                flyOptions.speed = 100;
            break;
            case "blue":
            default:
                flyOptions.speed = 50;
            break;
        }

        var flyUpdate = function(){
            if (this.body == null || this.isDead){
                return;
            }

            if (!this.isHit && !this.isDead){
               this.animations.play("idle"); 
            }

            var targetPlayer = {x: this.toybox.game.width + 16, x: this.toybox.game.height + 16,};

            for (var i = this.toybox.players.children.length - 1; i >= 0; i--) {
                var newPlayer = this.toybox.players.children[i];
                var targetDist = Math.sqrt((Math.abs(this.y - targetPlayer.y))^2 + (Math.abs(this.x - targetPlayer.x))^2);
                var newDist = Math.sqrt((Math.abs(this.y - newPlayer.y))^2 + (Math.abs(this.x - newPlayer.x))^2);
                if( newDist < targetDist ){
                    targetPlayer = newPlayer;
                }
            }

            if( (targetPlayer.x < this.x && this.scale.x < 0) || (targetPlayer.x > this.x && this.scale.x > 0) ){
                this.turnAround();
            }

            if (targetPlayer.y < this.y ){
               this.body.velocity.y = this.speed * -1;
            } else if (targetPlayer.y > this.y ) {
               this.body.velocity.y = this.speed;
            }

            if (this.scale.x > 0 ){
               this.body.velocity.x = this.speed * -1;
            } else if (this.scale.x < 0 ) {
               this.body.velocity.x = this.speed;
            }
        };

        flyOptions.update = flyUpdate;

        var flyGO = this.toybox.add.mob(flyOptions);

        flyGO.turnAround = function(){
            if (!this.canTurnAround || this.isDead){
                return;
            }
            this.scale.x *= -1;
            this.toybox.sfx.flyTurn.play();
            this.canTurnAround = false;
            var thisFly = this;
            this.toybox.game.time.events.add(500, function(){ thisFly.canTurnAround = true; }, this);
        }

        flyGO.hit = function(){
            if (this.isHit){
                return;
            }
            this.isHit = true;
            this.health -= 1;
            var thisFly = this;
            if (thisFly.health <= 0){
                this.animations.play("dead");
                this.isDead = true;
                this.body.velocity.y = 0;
                this.toybox.sfx.flyDie.play();
                this.body.allowGravity = true;
                this.toybox.game.time.events.add(1000, function(){
                    thisFly.kill();
                }, this);
            } else {
                this.toybox.game.time.events.add(500, function(){
                    thisFly.animations.play("idle");
                    thisFly.isHit = false; 
                }, this);
            }
        }

        var fps = this.toybox.animationFPS;
        flyGO.animations.add("dead", [2]);
        flyGO.animations.add("idle", [0, 1], fps, true);

        flyGO.canTurnAround = true;
        flyGO.isHit = false;
        flyGO.isDead = false;

        return flyGO;
 	}
     
};