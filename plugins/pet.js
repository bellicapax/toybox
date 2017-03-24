

var petToyboxPlugin = {
 	name: "pet",
    toyboxType: "mob",

 	preload: function(toyboxObject){
        toyboxObject._game.load.spritesheet("heartsAndStar", "../../assets/sprites/heartsAndStarSheet.png", 16, 16);
 	},

    sfx: [],

 	create: function(petOptions){
        if (typeof(this.toybox.loadedPlugins[petOptions.type]) !== "undefined"){
            petGO = this.toybox.add[petOptions.type](petOptions);
        } else {
            console.log(petOptions.type + ' plugin was not found');
            return;
        };

        petGO.name = "pet-" + petGO.name;

        petGO.owner = (typeof(petOptions.owner) !== "undefined")? petOptions.owner : this.toybox.players.children[0];

        petGO.findTarget = function(){
            if (this.canMakeHeart && this.health > 0){
                this.canMakeHeart = false;
                this.makeHeart();
                var thisPet = this;
                this.toybox.game.time.events.add(250, function(){
                    thisPet.canMakeHeart = true;
                } , this);
            }
            return this.owner;
        };

        petGO.isPlayer = function(){
            return true;
        };

        petGO.isMob = function(){
            return false;
        };

        petGO.canMakeHeart = true;

        petGO.makeHeart = function(){
            var heartOptions = {
                spriteName: "heartsAndStar",
                spriteIndex: 4,
                startingX: this.x + Phaser.Math.between(-4,4),
                startingY: this.y - (this.height / 2) - 4 + Phaser.Math.between(-4,4),
                scale: 0.5,
                sendTo: "top",
                update: function(){
                    this.timer = ((this.timer + 1 ) % 60);
                    this.y -= 0.5;
                    var dX = Math.sin( this.timer * 7.28 / 60 )
                    this.x += dX;
                    this.scale.x *= 1.01;
                    this.scale.y *= 1.01;
                }
            };
            newHeart = this.toybox.add.decoration(heartOptions);
            newHeart.timer = Phaser.Math.between(0,20);
            this.toybox.game.time.events.add(750, this.kill , newHeart);
        };

        return petGO;
 	}

};
