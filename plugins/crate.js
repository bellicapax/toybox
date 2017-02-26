
var crateToyboxPlugin = {
 	name: "crate",
    toyboxType: "block",

 	preload: function(toyboxObject){
 		toyboxObject._game.load.spritesheet("cratesAndOre", "../../assets/sprites/cratesAndOreSheet.png", 16, 16);
 		toyboxObject._game.load.spritesheet("poof", "../../assets/sprites/poofSheet.png", 16, 24);
 	},

 	create: function(crateOptions){
 		crateOptions.spriteName = "cratesAndOre";
     	crateOptions.scale = crateOptions.scale || this.toybox.diceRoll(4);
     	crateOptions.spriteIndex = crateOptions.type || this.toybox.diceRoll(4) - 1;
     	crateOptions.name = "type" + crateOptions.type + "Crate";
     	crateOptions.drag = (crateOptions.scale ^ 2) * 50;

     	var crateKill = function(crate){
            var poofOptions = {
                startingX: crate.x,
                startingY: crate.y,
                spriteName: "poof",
                sendTo: "top"
            }
            var poofGO = this.toybox.add.decoration(poofOptions);
            poofGO.animations.add("poof", [0, 1, 2, 3], this.toybox.animationFPS, true);
            poofGO.animations.play("poof");
            this.game.time.events.add(250, function(){ poofGO.kill(); }, this);
        }

        crateOptions.kill = crateKill;

     	var crateGO = this.toybox.add.block(crateOptions);
     	return crateGO;
 	}
     
};