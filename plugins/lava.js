
var lavaToyboxPlugin = {
 	name: "lava",
    toyboxType: "decoration",

 	preload: function(toyboxObject){
 		toyboxObject._game.load.spritesheet("lava", "../../assets/sprites/wavesSheet.png", 128, 16);
 	},

 	create: function(lavaOptions){

 		var validColors = ["yellow","orange","red","darkblue","lightblue","green","brown","black"];

        var randomizeLava = function() {
            return validColors[Phaser.Math.between(0,(validColors.length - 1))];
        }

 		lavaOptions.color = (typeof(lavaOptions.color) !== 'undefined') ? lavaOptions.color : randomizeLava();
 		lavaOptions.sendTo = "top";
 		lavaOptions.spriteName = "lava";

 		switch(lavaOptions.color){
 			case "orange":
 				lavaOptions.spriteIndex = 0;
 				break;
 			case "green":
 				lavaOptions.spriteIndex = 1;
 				break;
 			case "lightblue":
 				lavaOptions.spriteIndex = 2;
 				break;
 			case "brown":
 				lavaOptions.spriteIndex = 3;
 				break;
 			case "black":
 				lavaOptions.spriteIndex = 5;
 				break;
 			case "red":
 				lavaOptions.spriteIndex = 6;
 				break;
 			case "yellow":
 				lavaOptions.spriteIndex = 7;
 				break;
 			case "darkblue":
 			case "blue":
 			default:
 				lavaOptions.spriteIndex = 4;
 				break;
 		}

     	var lavaGO = this.toybox.add.decoration(lavaOptions);
     	lavaGO.name = lavaOptions.color + 'lava';
     	//lavaGO.width = (typeof(lavaOptions.width) !== 'undefined') ? lavaOptions.width : 128;
        //lavaGO.height = (typeof(lavaOptions.height) !== 'undefined') ? lavaOptions.height : 16;

        var killBlockOptions = {
        	startingX: lavaOptions.startingX,
        	startingY: lavaOptions.startingY,
        	collide: function(killBlock, collidedSprite){
        		if (collidedSprite.isPlayer() || collidedSprite.isMob){
        			if (collidedSprite.health > 0){
        				collidedSprite.health = 0;
        			}
        		} else {
        			collidedSprite.kill();
        		}
        	}
        }

        var killBlockGO = this.toybox.add.block(killBlockOptions);
        killBlockGO.width = lavaGO.width;
        killBlockGO.height = 1;

     	return lavaGO;
 	}
     
};