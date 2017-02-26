var mushroomToyboxPlugin = {
 	name: "mushroom",
    toyboxType: "collectible",

 	preload: function(toyboxObject){
 		toyboxObject._game.load.spritesheet("smallMushrooms", "../../assets/sprites/smallMushroomsSheet.png", 16, 16);
 	},

 	create: function(mushroomOptions){

 		var randomizeShroom = function() {
            var probability = toybox.diceRoll(40);
            if (probability <= 10) {
                return "red";
            } else if (probability <= 20){
                return "yellow";
            } else if (probability <= 30){
                return "blue";
            } else {
                return "purple";
            }
        }

        mushroomOptions.color = mushroomOptions.color || randomizeShroom();
        mushroomOptions.spriteName = "smallMushrooms";
        mushroomOptions.name = mushroomOptions.color + "Mushroom";

        var tryGrowObject = function(mushroom, sprite2) {
    	    if ( sprite2.isPlayer() || sprite2.isMob() ) {
    	        if (sprite2.scale.x <= 3.0){
    	            var tempSize = Math.abs(sprite2.scale.x)
    	            var newSize = tempSize * 1.5;
                    Phaser.Math.clamp(newSize, 0.25, 5);
    	            var scaleBy = (newSize / tempSize);
    	            sprite2.scale.x *= scaleBy;
    	            sprite2.scale.y *= scaleBy;
    	        }
    	        mushroom.kill();
    	    }
    	}
	
    	var tryShrinkObject = function(mushroom, sprite2) {
    	    if ( sprite2.isPlayer() || sprite2.isMob() ) {
    	        if (sprite2.scale.x <= 3.0){
    	            var tempSize = Math.abs(sprite2.scale.x)
    	            var newSize = tempSize * 0.5;
                    Phaser.Math.clamp(newSize, 0.25, 5);
    	            var scaleBy = (newSize / tempSize);
    	            sprite2.scale.x *= scaleBy;
    	            sprite2.scale.y *= scaleBy;
    	        }
    	        mushroom.kill();
    	    }
    	}
	
    	var trySpeedUpObject = function(mushroom, sprite2) {
    	    if ( sprite2.isPlayer() || sprite2.isMob() ) {
    	        if (sprite2.speed <= 300){
    	            sprite2.speed += 50;
    	        }
    	        mushroom.kill();
    	    }
    	}
	
    	var trySlowObject = function(mushroom, sprite2) {
    	    if ( sprite2.isPlayer() || sprite2.isMob() ) {
    	        if (sprite2.speed >= 100){
    	            sprite2.speed -= 50;
    	        }
    	        mushroom.kill();
    	    }
    	}

        switch (mushroomOptions.color){
            case "yellow":
                mushroomOptions.spriteIndex = 14;
                mushroomOptions.collide = trySpeedUpObject;
            break;
            case "red":
                mushroomOptions.spriteIndex = 11;
                mushroomOptions.collide = trySlowObject;
            break;
            case "blue":
                mushroomOptions.spriteIndex = 20;
                mushroomOptions.collide = tryShrinkObject;
            break;
            default:
                mushroomOptions.spriteIndex = 23;
                mushroomOptions.collide = tryGrowObject;
            break;
        }
        var mushroomGO = this.toybox.add.collectible(mushroomOptions);
        return mushroomGO;

 	}
     
};