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

        var tryGrowPlayer = function(sprite1, sprite2) {
    	    if (this.spriteIsPlayer(sprite2)) {
    	        var playerGO = sprite2;
    	        if (playerGO.scale.x <= 3.0){
    	            var tempSize = Math.abs(playerGO.scale.x)
    	            var newSize = tempSize + 0.25;
    	            var scaleBy = (newSize / tempSize);
    	            playerGO.scale.x *= scaleBy;
    	            playerGO.scale.y *= scaleBy;
    	        }
    	        sprite1.destroy();
    	    }
    	}
	
    	var tryShrinkPlayer = function(sprite1, sprite2) {
    	    if (this.spriteIsPlayer(sprite2)) {
    	        var playerGO = sprite2;
    	        if (playerGO.scale.x <= 3.0){
    	            var tempSize = Math.abs(playerGO.scale.x)
    	            var newSize = tempSize - 0.25;
    	            var scaleBy = (newSize / tempSize);
    	            playerGO.scale.x *= scaleBy;
    	            playerGO.scale.y *= scaleBy;
    	        }
    	        sprite1.destroy();
    	    }
    	}
	
    	var trySpeedUpPlayer = function(sprite1, sprite2) {
    	    if (this.spriteIsPlayer(sprite2)) {
    	        var playerGO = sprite2;
    	        if (playerGO.speed <= 300){
    	            playerGO.speed += 50;
    	        }
    	        sprite1.destroy();
    	    }
    	}
	
    	var trySlowPlayer = function(sprite1, sprite2) {
    	    if (this.spriteIsPlayer(sprite2)) {
    	        var playerGO = sprite2;
    	        if (playerGO.speed >= 100){
    	            playerGO.speed -= 50;
    	        }
    	        sprite1.destroy();
    	    }
    	}

        switch (mushroomOptions.color){
            case "yellow":
                mushroomOptions.spriteIndex = 14;
                mushroomOptions.collide = trySpeedUpPlayer;
            break;
            case "red":
                mushroomOptions.spriteIndex = 11;
                mushroomOptions.collide = trySlowPlayer;
            break;
            case "blue":
                mushroomOptions.spriteIndex = 20;
                mushroomOptions.collide = tryShrinkPlayer;
            break;
            default:
                mushroomOptions.spriteIndex = 20;
                mushroomOptions.collide = tryGrowPlayer;
            break;
        }
        var mushroomGO = this.toybox.add.collectible(mushroomOptions);
        return mushroomGO;

 	}
     
};