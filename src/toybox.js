
class Toybox {
    constructor(game, gameOptions) {

        gameOptions.gravity = gameOptions.gravity || 980;

        console.log("Toybox constructed");
        this.pluginsArray = gameOptions.plugins;
        this._game = game;
        this._game.stage.smoothed = false;
        this._game.physics.startSystem(Phaser.Physics.ARCADE);
        this._game.physics.arcade.gravity.y = gameOptions.gravity;
        this.currentGameObjects = [];
        this.bottomDecorations = new Phaser.Group(game, null, 'decorations', true);
        this.collectibles = new Phaser.Group(game, null, 'collectibles', true);
        this.blocks = new Phaser.Group(game, null, 'blocks', true);
        this.mobs = new Phaser.Group(game, null, 'mobs', true);
        this.players = new Phaser.Group(game, null, 'players', true);
        this.topDecorations = new Phaser.Group(game, null, 'effects', true);

        this.animationFPS = 12;
        this._currencyDisplay = null;
        this._add = new ToyboxGameObjectFactory(this);
    }

    get add() {
        return this._add;
    }

    get game() {
        return this._game;
    }

    get currencyDisplay() {
        return this._currencyDisplay;
    }

    set currencyDisplay(displayGO) {
        this._currencyDisplay = displayGO;
    }

    addGameObject(go) {
        if (this.currentGameObjects.indexOf(go) === -1) {
            this.currentGameObjects.push(go);
        }
    }

    addPlayer(go) {
        this.addGameObject(go);
        this.players.add(go);
    }

    addCollectible(go) {
        this.addGameObject(go);
        this.collectibles.add(go);
    }

    addBlock(go) {
        this.addGameObject(go);
        this.blocks.add(go);
    }

    addDecoration(go) {
        this.addGameObject(go);
        switch (go.sendTo){
            case 'top':
                this.topDecorations.add(go);
                break;
            case 'bottom':
            default:
                this.bottomDecorations.add(go);
                break;
        }
    }

    addMob(go) {
        this.addGameObject(go);
        this.mobs.add(go);
    }

    // helpers

    spriteIsPlayer(spriteGO) {
        return (
            (spriteGO !== null) && 
            (typeof(spriteGO) !== "undefined") &&
            (spriteGO.name.substring(0, 6) == "player")
            );
    }

    diceRoll(diceSides) {
        return Math.floor(Math.random() * diceSides) + 1;
    }

    oneOutOf(howManyTimes) {
        return (this.diceRoll(howManyTimes) == howManyTimes);
    }

    xOutOfYTimes(x, y) {
        return (this.diceRoll(y) == (y - (x - 1)));
    }

    preload() {
        this.preloadPlugins()
        // this._game.load.spritesheet("greenAlien", "../../assets/sprites/greenAlienSheet.png", 16, 20);
        // this._game.load.spritesheet("blueAlien", "../../assets/sprites/blueAlienSheet.png", 16, 20);
        // this._game.load.spritesheet("pinkAlien", "../../assets/sprites/pinkAlienSheet.png", 16, 20);
        //this._game.load.spritesheet("coins", "../../assets/sprites/coinsSheet.png", 16, 16);
        //this._game.load.spritesheet("smallMushrooms", "../../assets/sprites/smallMushroomsSheet.png", 16, 16);
        //this._game.load.spritesheet("cratesAndOre", "../../assets/sprites/cratesAndOreSheet.png", 16, 16);

        this.preloadMobs();
    }

    preloadPlugins(){
        this.loadedPlugins = {};
        if (typeof(this.pluginsArray) !== "undefined") {
            for (var index = this.pluginsArray.length - 1; index >= 0; index--) {
                var pluginName = this.pluginsArray[index];
                var pluginObject = window[pluginName + 'ToyboxPlugin'];
                this.loadedPlugins[pluginName] = pluginObject;
                this.add[pluginName] = pluginObject.create;
                pluginObject.preload(this);
            }
        }
    }

    preloadMobs() {
        this._game.load.spritesheet("blackFly", "../../assets/sprites/blackFlySheet.png", 16, 16);
        this._game.load.spritesheet("blueFly", "../../assets/sprites/blueFlySheet.png", 16, 16);
        this._game.load.spritesheet("blackSlime", "../../assets/sprites/blackSlimeSheet.png", 16, 16);
        this._game.load.spritesheet("blueSlime", "../../assets/sprites/blueSlimeSheet.png", 16, 16);
        this._game.load.spritesheet("blueSnail", "../../assets/sprites/blueSnailSheet.png", 16, 16);
        this._game.load.spritesheet("greenFish", "../../assets/sprites/greenFishSheet.png", 16, 16);
        this._game.load.spritesheet("greenSlime", "../../assets/sprites/greenSlimeSheet.png", 16, 16);
        this._game.load.spritesheet("purpleSlime", "../../assets/sprites/purpleSlimeSheet.png", 16, 16);
        this._game.load.spritesheet("redFly", "../../assets/sprites/redFlySheet.png", 16, 16);
        this._game.load.spritesheet("redSlime", "../../assets/sprites/redSlimeSheet.png", 16, 16);
        this._game.load.spritesheet("silverFish", "../../assets/sprites/silverFishSheet.png", 16, 16);
        this._game.load.spritesheet("yellowFly", "../../assets/sprites/yellowFlySheet.png", 16, 16);
        this._game.load.spritesheet("yellowSlime", "../../assets/sprites/yellowSlimeSheet.png", 16, 16);
        this._game.load.spritesheet("yellowSnail", "../../assets/sprites/yellowSnailSheet.png", 16, 16);

    }

    update() {
        var myToybox = this;
        this.currentGameObjects.forEach(function (gameObject) {
            gameObject.update();
        });
        this._game.physics.arcade.collide(this.currentGameObjects, this.currentGameObjects);
    }

}
