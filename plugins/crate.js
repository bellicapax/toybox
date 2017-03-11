
var crateToyboxPlugin = {
 	name: "crate",
    toyboxType: "block",

 	preload: function(toyboxObject){
 		toyboxObject._game.load.spritesheet("cratesAndOre", "../../assets/sprites/cratesAndOreSheet.png", 16, 16);
 		toyboxObject._game.load.spritesheet("poof", "../../assets/sprites/poofSheet.png", 16, 24);
 		toyboxObject._game.load.audio("crateBump", "../../assets/sfx/impact-3.wav");
 	},

 	sfx: ["crateBump"],

 	create: function(crateOptions){
    crateOptions = typeof (crateOptions) == "undefined" ? {} : crateOptions;
    
 		crateOptions.spriteName = "cratesAndOre";
     	crateOptions.scale = crateOptions.scale || this.toybox.diceRoll(4);
     	crateOptions.spriteIndex = crateOptions.type || this.toybox.diceRoll(4) - 1;
     	crateOptions.name = "type" + crateOptions.type + "Crate";
     	crateOptions.drag = (crateOptions.scale ^ 2) * 50;

     	var crateCollide = function(crate, collidedSprite){
     		if( (crate.body.velocity.x >= 100 || crate.body.velocity.y >= 100) && !crate.bumped){
   				crate.bump();
     		}
     	}

     	crateOptions.collide = crateCollide;

     	var crateUpdate = function(){
     		if (this.body == null){
     			return;
     		}
            if (this.body.touching.down){
                this.body.velocity.x *= 0.95;
            }
        }

        crateOptions.update = crateUpdate;

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
     	crateGO.bumped = false;

     	crateGO.bump = function(){
     		this.bumped = true;
     		this.toybox.sfx.crateBump.play();
     		var thisCrate = this;
     		this.toybox.game.time.events.add(2000, function(){ thisCrate.bumped = false; }, this);
     	};

     	return crateGO;
 	}

};
