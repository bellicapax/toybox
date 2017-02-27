
var springToyboxPlugin = {
 	name: "spring",
    toyboxType: "block",

 	preload: function(toyboxObject){
 		toyboxObject._game.load.spritesheet("spring", "../../assets/sprites/springSheet.png", 16, 16);
        toyboxObject._game.load.audio("springBounce", "../../assets/sfx/jump-1.wav");
 	},

 	sfx: ["springBounce"],

 	create: function(springOptions){
 		springOptions.spriteName = "spring";
     	springOptions.spriteIndex = 2;
     	springOptions.name = "spring";
        //springOptions.immovable = true;

     	var springCollide = function(spring, collidedSprite){
            var onTop = ( collidedSprite.y + (collidedSprite.height / 2) < spring.y + (spring.height / 2))
     		if( onTop && !spring.hasBounced){
   				spring.bounce();
                var time = (1000 / this.toybox.animationFPS) * 2;
                this.toybox.game.time.events.add(time, function(){ collidedSprite.body.velocity.y = -700; }, this);
     		}
     	}

        springOptions.collide = springCollide;

        var springUpdate = function(){
            if (this.body == null){
                return;
            }
            if (this.body.touching.down){
                this.body.velocity.x *= 0.95;
            }
        }

        springOptions.update = springUpdate;


     	var springGO = this.toybox.add.block(springOptions);
     	springGO.hasBounced = false;
        springGO.animations.add("bounce", [2, 1, 0, 1, 2], this.toybox.animationFPS, false);

     	springGO.bounce = function(){
     		this.hasBounced = true;
     		this.toybox.sfx.springBounce.play();
            this.animations.play("bounce");
     		var thisSpring = this;
            var time = (1000 / this.toybox.animationFPS) * 6;
     		this.toybox.game.time.events.add(time, function(){ thisSpring.hasBounced = false; }, this);
     	};

     	return springGO;
 	}
     
};