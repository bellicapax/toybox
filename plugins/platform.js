
var platformToyboxPlugin = {
 	name: "platform",
    toyboxType: "block",

 	preload: function(toyboxObject){
 		toyboxObject._game.load.spritesheet("platforms", "../../assets/sprites/platformSheet.png", 128, 16);
 		toyboxObject._game.load.spritesheet("poof", "../../assets/sprites/poofSheet.png", 16, 24);
 	},

 	create: function(platformOptions){
    platformOptions = typeof (platformOptions) == "undefined" ? {} : platformOptions;
    
        if (typeof(platformOptions.spriteName) == "undefined"){
            platformOptions.spriteName = "platforms";
            platformOptions.spriteIndex = platformOptions.type || Phaser.Math.between(0,7);
            platformOptions.name = "type" + platformOptions.type + "Platform";
        } else {
            platformOptions.spriteIndex = 0;
            platformOptions.name = "customPlatform";
        }

     	platformOptions.allowGravity = false;
        platformOptions.immovable = true;

     	var platformKill = function(platform){
            var poofOptions = {
                startingX: platform.x,
                startingY: platform.y,
                spriteName: "poof",
                sendTo: "top"
            }
            var poofGO = this.toybox.add.decoration(poofOptions);
            poofGO.animations.add("poof", [0, 1, 2, 3], this.toybox.animationFPS, true);
            poofGO.animations.play("poof");
            this.game.time.events.add(250, function(){ poofGO.kill(); }, this);
        }

        platformOptions.kill = platformKill;

     	var platformGO = this.toybox.add.block(platformOptions);

        platformGO.width = platformOptions.width;
        platformGO.height = platformOptions.height;

     	return platformGO;
 	}

};
