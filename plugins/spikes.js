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
// unique spikesOptions attributes:
//		type: number, 0-3, determines sprite for spikes


var spikesToyboxPlugin = {
 	name: "spikes",
    toyboxType: "block",

 	preload: function(toyboxObject){
 		toyboxObject._game.load.spritesheet("spikes", "../../assets/sprites/spikeSheet.png", 16, 16);
 		toyboxObject._game.load.audio("spikesBump", "../../assets/sfx/impact-2.wav");
 	},

 	sfx: ["spikesBump"],

 	create: function(spikesOptions){
 		spikesOptions.spriteName = "spikes";
        spikesOptions.allowGravity =  false;
        spikesOptions.immovable = true;

        var validColors = ["red","blue","pink"];

        var randomizeSpikes = function() {
            return validColors[Phaser.Math.between(0,(validColors.length - 1))];
        }

        if (typeof(spikesOptions.color) == "undefined" || validColors.indexOf(spikesOptions.color) == -1){
            spikesOptions.color = randomizeSpikes();
        }

        switch (spikesOptions.color){
            case "blue":
                spikesOptions.spriteIndex = 1;
            break;
            case "green":
                spikesOptions.spriteIndex = 0;
            break;
            case "pink":
            default:
                spikesOptions.spriteIndex = 2;
            break;
        }

     	spikesOptions.name = spikesOptions.color + "Spikes";

     	var spikesCollide = function(spikes, collidedSprite){
     		if( collidedSprite.isPlayer() || collidedSprite.isMob() ){
                collidedSprite.hit();
   				spikes.bump();
     		}
     	}

     	spikesOptions.collide = spikesCollide;

     	var spikesGO = this.toybox.add.block(spikesOptions);
     	spikesGO.bumped = false;

     	spikesGO.bump = function(){
     		this.bumped = true;
     		this.toybox.sfx.spikesBump.play();
     		var thisSpikes = this;
     		this.toybox.game.time.events.add(2000, function(){ thisSpikes.bumped = false; }, this);
     	};

     	return spikesGO;
 	}
     
};