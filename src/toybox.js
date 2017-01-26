var player;
var speed = 1;
var cursors;

class Toybox {
    constructor(game) {
        console.log("Toybox constructed");
        this._game = game;
        this.currentGameObjects = [];
        cursors = this._game.input.keyboard.createCursorKeys();
        this.animationFPS = 8;
        this._add = new ToyboxGameObjectFactory(this);
    }

    get add() {
        return this._add;
    }

    get game() {
        return this._game;
    }

    addGameObject(go) {
        if (this.currentGameObjects.indexOf(go) !== -1) {
            this.currentGameObjects.push(go);
        }
    }

    preload() {
        this._game.load.spritesheet("greenAlien", "assets/sprites/greenAlienSheet.png", 16, 20);
        this._game.load.spritesheet("blueAlien", "assets/sprites/blueAlienSheet.png", 16, 20);
        this._game.load.spritesheet("pinkAlien", "assets/sprites/pinkAlienSheet.png", 16, 20);

        this.preloadMobs();
    }

    preloadMobs() {
        this._game.load.spritesheet("blackFly", "assets/sprites/blackFlySheet.png", 16, 16);
        this._game.load.spritesheet("blueFly", "assets/sprites/blueFlySheet.png", 16, 16);
        this._game.load.spritesheet("blackSlime", "assets/sprites/blackSlimeSheet.png", 16, 16);
        this._game.load.spritesheet("blueSlime", "assets/sprites/blueSlimeSheet.png", 16, 16);
        this._game.load.spritesheet("blueSnail", "assets/sprites/blueSnailSheet.png", 16, 16);
        this._game.load.spritesheet("greenFish", "assets/sprites/greenFishSheet.png", 16, 16);
        this._game.load.spritesheet("greenSlime", "assets/sprites/greenSlimeSheet.png", 16, 16);
        this._game.load.spritesheet("purpleSlime", "assets/sprites/purpleSlimeSheet.png", 16, 16);
        this._game.load.spritesheet("redFly", "assets/sprites/redFlySheet.png", 16, 16);
        this._game.load.spritesheet("redSlime", "assets/sprites/redSlimeSheet.png", 16, 16);
        this._game.load.spritesheet("silverFish", "assets/sprites/silverFishSheet.png", 16, 16);
        this._game.load.spritesheet("yellowFly", "assets/sprites/yellowFlySheet.png", 16, 16);
        this._game.load.spritesheet("yellowSlime", "assets/sprites/yellowSlimeSheet.png", 16, 16);
        this._game.load.spritesheet("yellowSnail", "assets/sprites/yellowSnailSheet.png", 16, 16);

    }

    create() {

    }

    update() {
        var myToybox = this;
        this.currentGameObjects.forEach(function (gameObject) {
            gameObject.update();
        });

    }

    addAnimationsToPlayer(player) {
        // player.animations.add("walk", [9, 10], 8, true);
        // player.animations.play("walk");
    }

    createPlayer(spritesheetName, startingX, startingY) {
        if (player != null) {
            player.destroy();
        }
        player = this._game.add.sprite(startingX, startingY, spritesheetName, 1);
        player.anchor.setTo(0.5, 0.5);
        this.addAnimationsToPlayer(player);
        player.toybox = this;
        player.update = function () {
            if (cursors.up.isDown) {
                this.y -= speed;
            } else if (cursors.down.isDown) {
                this.y += speed;
            }
            if (cursors.right.isDown) {
                this.x += speed;
            } else if (cursors.left.isDown) {
                this.x -= speed;
            }

            if (this.x > this.toybox._game.world.width) {
                this.x = 0;
            }
        };
        this.currentGameObjects.push(player);
        return player;
    }

}
