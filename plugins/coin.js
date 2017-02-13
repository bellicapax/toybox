var coinToyboxPlugin = {
    name: "coin",
    toyboxType: "collectible",

    preload: function(toyboxObject){
        toyboxObject._game.load.spritesheet("coins", "../../assets/sprites/coinsSheet.png", 16, 16);
    },

    create: function(coinOptions){

        var randomizeCoin = function() {
            var probability = toybox.diceRoll(50);
            if (probability <= 25) {
                return "bronze";
            } else if (probability <= 45){
                return "silver";
            } else {
                return "gold";
            }
        }

        coinOptions.spriteName = "coins";
        coinOptions.color = coinOptions.color || randomizeCoin();
        coinOptions.name = coinOptions.color + "Coin";

        var tryIncreaseCurrency = function(coin, collidedSprite) {
            if (this.spriteIsPlayer(collidedSprite)) {
                if (typeof(collidedSprite.stats.score) == "undefined"){
                    collidedSprite.stats.score = 0;
                }
                collidedSprite.stats.score += coin.currencyValue;
                coin.destroy();
            }
        }

        coinOptions.collide = tryIncreaseCurrency;
        switch (coinOptions.color){
            case "gold":
                coinOptions.spriteIndex = 2;
                coinOptions.bounce = 0.75;
                var currencyValue = 100;
            break;
            case "silver":
                coinOptions.spriteIndex = 1;
                coinOptions.bounce = 0.5;
                var currencyValue = 10;
            break;
            default:
                coinOptions.spriteIndex = 0;
                coinOptions.bounce = 0.25;
                var currencyValue = 1;
            break;
        }
        var coinGO = this.toybox.add.collectible(coinOptions);
        coinGO.currencyValue = currencyValue;
        return coinGO;
    }

};