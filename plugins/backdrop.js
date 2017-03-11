// decorationOptions attributes:
//     spriteName: string, name of spritesheet loaded in preload
//     spriteIndex: number, starting sprite in spritesheet
//     startingX: number, initial X location for sprite's center
//     startingY: number, initial Y location for sprite's center
//     scale: number, the size of the sprite as a multiple
//     update: function, this is run every update cycle
//     collide: function, this is added to the sprite's onCollide signal
//     kill: function, this is added to the sprite's onKilled signal
//     enablePhysics: boolean, true: sprite collides with other sprites
//     allowGravity: boolean, true: sprite falls with gravity
//     immovable: boolean, true: object will be fixed in place and cannot move
//     collideWorld: boolean, true: object will collide with the edges of the game
//     name: string, name of the object type, meant mostly for debugging
//
//	unique backdropOtions attributes:
//		preset: string, selects one of several preset backdrops
//			valid values: "grey", "green", "blue", "spring", "summer", "fall", "winter"


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

 		if (typeof(backdropOptions.preset) !== 'undefined'){
 			switch(backdropOptions.preset){
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
 		}

     	var backdropGO = this.toybox.add.decoration(backdropOptions);
     	backdropGO.anchor.setTo(0, 0);
     	backdropGO.name = backdropOptions.spriteName;
     	backdropGO.width = backdropGO.toybox.game.width;
     	backdropGO.height = backdropGO.toybox.game.height;
     	backdropGO.toybox.game.world.sendToBack(backdropGO);
     	return backdropGO;
 	}
     
};