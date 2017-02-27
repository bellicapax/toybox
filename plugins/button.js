
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
            var onTop = ( collidedSprite.y + (collidedSprite.height / 2) < button.y + (button.height / 2))
     		if( onTop && !button.depressed){
   				button.press();
     		}
     	}

        buttonOptions.collide = buttonCollide;

        var buttonUpdate = function(){
            if (this.body == null){
                return;
            }
            if (this.body.touching.down){
                this.body.velocity.x = 0;
            }
        }

        buttonOptions.update = buttonUpdate;

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
            this.onPress();
     		var thisButton = this;
     		this.toybox.game.time.events.add(2000, function(){ 
                thisButton.depressed = false;
                this.animations.play("unpressed");
            }, this);
     	};

     	return buttonGO;
 	}
     
};