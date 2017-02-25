var gemToyboxPlugin = {
    name: "gem",
    toyboxType: "collectible",

    preload: function(toyboxObject){
        toyboxObject._game.load.spritesheet("gems", "../../assets/sprites/gemsSheet.png", 16, 16);
    },

    create: function(gemOptions){

        var validColors = ["yellow","red","blue","green"];

        var randomizeGem = function() {
            return validColors[this.game.Math.between(0,(validColors.length - 1))];
        }

        gemOptions.spriteName = "gems";
        if (typeof(gemOptions.color) == "undefined" || validColors.indexOf(gemOptions.color) == -1){
            gemOptions.color = randomizeGem();
        }
        gemOptions.name = gemOptions.color + "Gem";
        gemOptions.allowGravity = false;

        var tryIncreaseCurrency = function(gem, collidedSprite) {
            if (this.spriteIsPlayer(collidedSprite)) {
                if (typeof(collidedSprite.score) == "undefined"){
                    collidedSprite.score = 0;
                }
                collidedSprite.score += gem.currencyValue;
                gem.destroy();
            }
        }

        gemOptions.collide = tryIncreaseCurrency;

        var gemGO = this.toybox.add.collectible(gemOptions);
        gemGO.currencyValue = 250;

        var fps = this.toybox.animationFPS;

        switch (gemOptions.color){
            case "yellow":
                gemGO.animations.add("yellowGlimmer", [0, 0, 0, 4], fps, true);
                gemGO.animations.play("yellowGlimmer");
            break;
            case "red":
                gemGO.animations.add("redGlimmer", [2, 6, 2, 2], fps, true);
                gemGO.animations.play("redGlimmer");
            break;
            case "blue":
                gemGO.animations.add("blueGlimmer", [3, 7, 7, 7], fps, true);
                gemGO.animations.play("blueGlimmer");
            break;
            default:
                gemGO.animations.add("greenGlimmer", [1, 1, 5, 1], fps, true);
                gemGO.animations.play("greenGlimmer");
            break;
        }

        return gemGO;
    }

};