   var crate = {

    	name: "crate",

    	preload: function(toyboxObject){
    		this.toybox = toyboxObject;
    		this.toybox._game.load.spritesheet("smallMushrooms", "../../assets/sprites/smallMushroomsSheet.png", 16, 16);
    	}

    	create: function(crateOptions){
    		crateOptions.spriteName = "cratesAndOre";
        	crateOptions.scale = crateOptions.scale || this.toybox.diceRoll(4);
        	crateOptions.spriteIndex = crateOptions.type || this.toybox.diceRoll(4) - 1;
        	crateOptions.name = "type" + crateOptions.type + "Crate";
        	crateOptions.drag = (crateOptions.scale ^ 2) * 50;
        	var crateGO = this.toybox.add.block(crateOptions);
        	return crateGO;
    	}
        
    };