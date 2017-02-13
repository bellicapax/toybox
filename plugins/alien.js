
var alienToyboxPlugin = {
 	name: "alien",
    toyboxType: "player",

 	preload: function(toyboxObject){
 		toyboxObject._game.load.spritesheet("greenAlien", "../../assets/sprites/greenAlienSheet.png", 16, 20);
        toyboxObject._game.load.spritesheet("blueAlien", "../../assets/sprites/blueAlienSheet.png", 16, 20);
        toyboxObject._game.load.spritesheet("pinkAlien", "../../assets/sprites/pinkAlienSheet.png", 16, 20);
 	},

 	create: function(alienOptions){
 		alienOptions.allowGravity = true;
        var validColors = ["green","blue","pink"];
        if (typeof(alienOptions.color) == "undefined" || validColors.indexOf(alienOptions.color) == -1){
            alienOptions.color = "green";
        }
        alienOptions.spriteName = alienOptions.color + "Alien";

        var alienPlatformerUpdate = function(){
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
        	    }
        	}
        };

        alienOptions.update = alienPlatformerUpdate;
        var alienGO = this.toybox.add.player(alienOptions);

        var fps = this.toybox.animationFPS;
        alienGO.animations.add("idle", [1]);
        alienGO.animations.add("run", [9, 10], fps, true);
        alienGO.animations.add("jump", [7, 8], fps, true);
        
        return alienGO;
 	}
     
};