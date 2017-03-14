// blockOptions attributes:
//     startingX: number, initial X location for sprite's center
//     startingY: number, initial Y location for sprite's center
//     scale: number, the size of the sprite as a multiple
//	   update: function, this is run every update cycle
//     collide: function, this is added to the sprite's onCollide signal
//     allowGravity: boolean, true: sprite falls with gravity
//     immovable: boolean, true: object will be fixed in place and cannot move
//     collideWorld: boolean, true: object will collide with the edges of the game
//     bounce: number, how elastic collisions with this object are
//     name: string, name of the object type, meant mostly for debugging
//
// unique multibrickOptions attributes:
//		type: number, 0-3, determines sprite for multibrick


var multibrickToyboxPlugin = {
 	name: "multibrick",
    toyboxType: "block",

 	preload: function(toyboxObject){
 		toyboxObject._game.load.spritesheet("multibrick", "../../assets/sprites/multibrickSheet.png", 16, 16);
 		toyboxObject._game.load.audio("multibrickBump", "../../assets/sfx/impact-1.wav");
 	},

 	sfx: ["multibrickBump"],

 	create: function(multibrickOptions){
    multibrickOptions = typeof (multibrickOptions) == "undefined" ? {} : multibrickOptions;
    
 		multibrickOptions.spriteName = "multibrick";
        multibrickOptions.allowGravity = false;
        multibrickOptions.immovable = true;

        var validColors = ["yellow","orange","blue","green","gray"];

        var randomizer = function(array) {
            return array[Phaser.Math.between(0,(array.length - 1))];
        }

        if (typeof(multibrickOptions.color) == "undefined" || validColors.indexOf(multibrickOptions.color) == -1){
            multibrickOptions.color = randomizer(validColors);
        }

        switch (multibrickOptions.color){
            case "yellow":
                multibrickOptions.baseSpriteIndex = 12;
            break;
            case "green":
                multibrickOptions.baseSpriteIndex = 24;
            break;
            case "orange":
                multibrickOptions.baseSpriteIndex = 0;
            break;
            case "blue":
                multibrickOptions.baseSpriteIndex = 36;
            break;
            case "gray":
            default:
                multibrickOptions.baseSpriteIndex = 48;
            break;
        }

        var validTypes = ["normal","coin","mushroom","pow","striped"];

        if (typeof(multibrickOptions.type) == "undefined" || validTypes.indexOf(multibrickOptions.type) == -1){
            multibrickOptions.type = randomizer(validTypes);
        }

        var noCoins = (typeof(this.toybox.loadedPlugins.coin) == "undefined")
        var noMushrooms = (typeof(this.toybox.loadedPlugins.mushroom) == "undefined")

        if (( noCoins && (multibrickOptions.type == "coin")) || ( noMushrooms && (multibrickOptions.type == "mushroom"))){
            multibrickOptions.type = "normal";
        }

        var powAction = function(collidedSprite){
            if (this.active == false) {
                return;
            }
            this.toybox.players.forEachAlive(function(player,collidedSprite){
                if (collidedSprite != player){ player.hit()};
            },this,collidedSprite);
            this.toybox.mobs.forEachAlive(function(mob){mob.hit()});
        }

        var coinAction = function(){
            if (this.active == false) {
                return;
            }
            this.toybox.add.coin({
                startingX: this.x,
                startingY: this.y - (this.height / 2) - 8,
                dX: Phaser.Math.between(-50,50),
                dY: -200
            });
        }

        var mushroomAction = function(){
            if (this.active == false) {
                return;
            }
            this.toybox.add.mushroom({
                startingX: this.x,
                startingY: this.y - (this.height / 2) - 8,
                dY: -200
            });
        }

        switch (multibrickOptions.type){
            case "coin":
                multibrickOptions.spriteIndex = multibrickOptions.baseSpriteIndex + 3;
                multibrickOptions.postBump = coinAction;
            break;
            case "mushroom":
                multibrickOptions.spriteIndex = multibrickOptions.baseSpriteIndex + 9;
                multibrickOptions.postBump = mushroomAction;
            break;
            case "pow":
                multibrickOptions.spriteIndex = multibrickOptions.baseSpriteIndex + 11;
                multibrickOptions.postBump = powAction;
            break;
            case "striped":
                multibrickOptions.spriteIndex = multibrickOptions.baseSpriteIndex + 1;
                multibrickOptions.spriteIndex += (Phaser.Math.between(0,1) * 6);
            break;
            case "normal":
            default:
                multibrickOptions.spriteIndex = multibrickOptions.baseSpriteIndex + (Phaser.Math.between(0,1) * 6);
                multibrickOptions.postBump = function(){};
            break;
        }

     	multibrickOptions.name = multibrickOptions.color + multibrickOptions.type + "Multibrick";

     	var multibrickCollide = function(multibrick, collidedSprite){
            var spriteNotOnSide = Math.abs(collidedSprite.x - multibrick.x) < (multibrick.width / 2);
            var spriteCanBeHit = collidedSprite.isMob() || collidedSprite.isPlayer();
     		if( collidedSprite.y > multibrick.y && !multibrick.bumped && spriteNotOnSide){
   				multibrick.bump(collidedSprite);
     		} else if (collidedSprite.y < multibrick.y && multibrick.bumped && spriteNotOnSide && spriteCanBeHit) {
                collidedSprite.hit();
            }
     	}

     	multibrickOptions.collide = multibrickCollide;

     	var multibrickGO = this.toybox.add.block(multibrickOptions);
        multibrickGO.postBump = multibrickOptions.postBump;
        multibrickGO.resetTimer = multibrickOptions.resetTimer;
     	multibrickGO.bumped = false;
        multibrickGO.animations.add("active", [multibrickOptions.spriteIndex]);
        multibrickGO.animations.add("inactive", [multibrickOptions.baseSpriteIndex]);
        multibrickGO.animations.play("active")
        if (["coin","pow","mushroom"].indexOf(multibrickOptions.type) == -1){
            multibrickGO.active = false;
        } else {
            multibrickGO.active = true;
        }

     	multibrickGO.bump = function(collidedSprite){
     		this.bumped = true;
     		this.toybox.sfx.multibrickBump.play();
            this.y -= 2;
            this.postBump(collidedSprite);
            this.active = false;
            this.animations.play("inactive");
            if (typeof(this.resetTimer) == "number"){
                this.toybox.game.time.events.add(this.resetTimer, this.reActivate , this);
            }
     		this.toybox.game.time.events.add(250, this.unBump , this);
     	};

        multibrickGO.unBump = function(){
            this.bumped = false;
            this.y += 2;
        };

        multibrickGO.reActivate = function(){
            this.active = true;
            this.animations.play("active");
        }

     	return multibrickGO;
 	}

};
