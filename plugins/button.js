
var buttonToyboxPlugin = {
 	name: "button",
  toyboxType: "block",

 	preload: function(toyboxObject){
 		 toyboxObject._game.load.spritesheet("button", "../../assets/sprites/buttonsSheet.png", 16, 16);
     toyboxObject._game.load.audio("buttonClick", "../../assets/sfx/door-1.wav");
 	},

  sfx: ["buttonClick"],

 	create: function(buttonOptions){
      buttonOptions.spriteName = "button";

      var validColors = ["yellow","red","blue","green"];

      var randomizeButton = function() {
          return validColors[Phaser.Math.between(0,(validColors.length - 1))];
      }

      if (typeof(buttonOptions.color) == "undefined" || validColors.indexOf(buttonOptions.color) == -1){
          buttonOptions.color = randomizeButton();
      }

     	buttonOptions.name = buttonOptions.color + "button";

      switch (buttonOptions.color){
          case "yellow":
              buttonOptions.spriteIndex = 0;
          break;
          case "red":
              buttonOptions.spriteIndex = 2;
          break;
          case "blue":
              buttonOptions.spriteIndex = 3;
          break;
          default:
              buttonOptions.spriteIndex = 1;
          break;
      }

     	var buttonCollide = function(button, collidedSprite){
        var bottomOfCollided = collidedSprite.y + (collidedSprite.height / 2);
        var topOfButton = button.y + (button.height / 2);
        var onTop = bottomOfCollided < topOfButton;
        var falling = collidedSprite.body.velocity.y > 0;
     		if( onTop && falling && !button.depressed){
   				button.press();
     		}
     	}

      buttonOptions.collide = buttonCollide;

      buttonOptions.onPress = (typeof(buttonOptions.onPress) == "function") ? buttonOptions.onPress : function(){};

     	var buttonGO = this.toybox.add.block(buttonOptions);
     	buttonGO.depressed = false;
      buttonGO.onPress = buttonOptions.onPress;
      buttonGO.animations.add("unpressed", [buttonOptions.spriteIndex], this.toybox.animationFPS, true);
      buttonGO.animations.add("pressed", [buttonOptions.spriteIndex + 4], this.toybox.animationFPS, true);

     	buttonGO.press = function(){
     		this.depressed = true;
     		this.toybox.sfx.buttonClick.play();
        this.animations.play("pressed");
        this.body.checkCollision.up = false;
        this.onPress();
     		this.toybox.game.time.events.add(1000, function(){
                this.depressed = false;
                this.animations.play("unpressed");
                this.body.checkCollision.up = true;
            }, this);
     	};

      buttonGO.body.checkCollision = {none: false, any: true, up: true, down: true, left: false, right: false};

     	return buttonGO;
 	}

};
