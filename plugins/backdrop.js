
var backdropToyboxPlugin = {
 	name: "backdrop",
    toyboxType: "decoration",

 	preload: function(toyboxObject){
 		toyboxObject._game.load.spritesheet("greyBackdrop", "../../assets/sprites/single-images/greyBackdrop.png", 256, 128);
 		toyboxObject._game.load.spritesheet("greenBackdrop", "../../assets/sprites/single-images/greenBackdrop.png", 256, 128);
 		toyboxObject._game.load.spritesheet("blueBackdrop", "../../assets/sprites/single-images/blueBackdrop.png", 256, 128);
 		toyboxObject._game.load.spritesheet("springBackdrop", "../../assets/sprites/single-images/springBackdrop.png", 160, 144);
 		toyboxObject._game.load.spritesheet("summerBackdrop", "../../assets/sprites/single-images/summerBackdrop.png", 160, 144);
 		toyboxObject._game.load.spritesheet("fallBackdrop", "../../assets/sprites/single-images/fallBackdrop.png", 160, 144);
 		toyboxObject._game.load.spritesheet("winterBackdrop", "../../assets/sprites/single-images/winterBackdrop.png", 160, 144);
 	},

 	create: function(backdropOptions){
 		backdropOptions = typeof (backdropOptions) == "undefined" ? {} : backdropOptions;

 		backdropOptions.startingX = 0;
 		backdropOptions.startingY = 0;

 		switch(backdropOptions.name){
 			case "spring":
 				backdropOptions.spriteName = "springBackdrop";
 				break;
 			case "summer":
 				backdropOptions.spriteName = "summerBackdrop";
 				break;
 			case "fall":
 				backdropOptions.spriteName = "fallBackdrop";
 				break;
 			case "winter":
 				backdropOptions.spriteName = "winterBackdrop";
 				break;
 			case "grey":
 				backdropOptions.spriteName = "greyBackdrop";
 				break;
 			case "green":
 				backdropOptions.spriteName = "greenBackdrop";
 				break;
 			case "blue":
 			default:
 				backdropOptions.spriteName = "blueBackdrop";
 				break;
 		}

     	var backdropGO = this.toybox.add.decoration(backdropOptions);
     	backdropGO.anchor.setTo(0, 0);
     	backdropGO.width = backdropGO.toybox.game.width;
     	backdropGO.height = backdropGO.toybox.game.height;
     	backdropGO.toybox.game.world.sendToBack(backdropGO);
     	return backdropGO;
 	}
     
};