
class ToyboxGameObjectFactory {
    constructor(toybox) {
        this.toybox = toybox;
        this.playerGO = null;
    }

    // var playerOptions = {
    //     startingX : 0,
    //     startingY: 0,
    //     color: "green"
    //     spritesheetName: this.color + "Alien",
    //     jumpForce: 300,
    //     speed: 100,
    //     scale: 1
    // }

    player(playerOptions) {
        var playerGO = this.playerGO;
        if (playerGO != null) {
            playerGO.destroy();
        }
        var spritesheetName = playerOptions.color + "Alien";
        playerGO = this.toybox.game.add.sprite(playerOptions.startingX, playerOptions.startingY, "greenAlien", 1);
        playerGO.name = "player1";
        playerGO.anchor.setTo(0.5, 0.5);
        this.toybox.game.physics.enable(playerGO);
        playerGO.body.collideWorldBounds = true;
        this.addAnimationsToPlayer(playerGO);
        playerGO.toybox = this.toybox;
        playerGO.update = this.playerPlatformerUpdate;
        playerGO.scale.x = playerOptions.scale;
        playerGO.scale.y = playerOptions.scale;
        playerGO.speed = playerOptions.speed;
        playerGO.jumpForce = playerOptions.jumpForce;
        this.toybox.addGameObject(playerGO);
        return playerGO;
    }

    playerPlatformerUpdate() {
        if (cursors.right.isDown) {
            this.body.velocity.x = this.speed;
            if (this.scale.x < 0) {
                this.scale.x *= -1;
            }
            if (this.animations.name !== "run") {
                this.animations.play("run");
            }
        } else if (cursors.left.isDown) {
            this.body.velocity.x = -this.speed;
            if (this.scale.x > 0) {
                this.scale.x *= -1;
            }
            if (this.animations.name !== "run") {
                this.animations.play("run");
            }
        } else {
            // Not moving
            this.body.velocity.x = 0;
            this.animations.play("idle");
        }

        // checkForJump
        if (spacebar.isDown && (this.body.onFloor() || this.body.touching.down)) {
            this.body.velocity.y = -this.jumpForce;
            if (this.animations.name !== "jump") {
                this.animations.play("jump");
            }
        }
    }

    addAnimationsToPlayer(player) {
        var fps = this.toybox.animationFPS;
        player.animations.add("idle", [1]);
        player.animations.add("run", [9, 10], fps, true);
        player.animations.add("jump", [7, 8], fps, true);
    }

    collectible(spriteName, startingX, startingY) {
        var collectibleGO = this.toybox.game.add.sprite(startingX, startingY, spriteName);
        collectibleGO.anchor.setTo(0.5, 0.5);
        this.toybox.game.physics.enable(collectibleGO);
        collectibleGO.body.collideWorldBounds = true;
        collectibleGO.body.bounce.set(0.4);
        collectibleGO.name = spriteName;
        collectibleGO.toybox = this.toybox;
        collectibleGO.update = function () {};
        collectibleGO.body.onCollide = new Phaser.Signal();
        this.toybox.addCollectible(collectibleGO);
        return collectibleGO;
    }

    mushroom(color, startingX, startingY){
        var spriteName;
        var collisionFunc;
        switch (color){
            case "yellow":
                spriteName = "yellowMushroom";
                collisionFunc = "trySpeedUpPlayer";
            break;
            case "red":
                spriteName = "redMushroom";
                collisionFunc = "trySlowPlayer";
            break;
            case "blue":
                spriteName = "blueMushroom";
                collisionFunc = "tryShrinkPlayer";
            break;
            default:
                spriteName = "purpleMushroom";
                collisionFunc = "tryGrowPlayer";
            break;
        }
        var mushroomGO = this.toybox.add.collectible(spriteName, startingX, startingY);
        mushroomGO.body.onCollide.add(this[collisionFunc], mushroomGO);
        return mushroomGO;
    }

    tryGrowPlayer(sprite1, sprite2) {
        if (sprite2 !== null && sprite2.name === "player1") {
            if (size <= 3.0){
                var newSize = size + 0.25;
                var scaleBy = (newSize / size);
                size = newSize;
                sprite2.scale.x *= scaleBy;
                sprite2.scale.y *= scaleBy;
            }
            sprite1.destroy();
        }
    }

    tryShrinkPlayer(sprite1, sprite2) {
        if (sprite2 !== null && sprite2.name === "player1") {
            if (size >= 0.5){
                var newSize = size - 0.25;
                var scaleBy = (newSize / size);
                size = newSize;
                sprite2.scale.x *= scaleBy;
                sprite2.scale.y *= scaleBy;
            }
            sprite1.destroy();
        }
    }

    trySpeedUpPlayer(sprite1, sprite2) {
        if (sprite2 !== null && sprite2.name === "player1") {
            if (speed <= 300){
                speed += 50;
            }
            sprite1.destroy();
        }
    }

    trySlowPlayer(sprite1, sprite2) {
        if (sprite2 !== null && sprite2.name === "player1") {
            if (speed >= 100){
                speed -= 50;
            }
            sprite1.destroy();
        }
    }

    block(spriteName, startingX, startingY) {
        var blockGO = this.toybox.game.add.sprite(startingX, startingY, spriteName);
        blockGO.anchor.setTo(0.5, 0.5);
        this.toybox.game.physics.enable(blockGO);
        blockGO.body.collideWorldBounds = true;
        blockGO.body.bounce.set(0.4);
        blockGO.body.drag.x = 500;
        blockGO.name = "block";
        blockGO.toybox = this.toybox;
        blockGO.update = function () {};
        this.toybox.addCollectible(blockGO);
        return blockGO;
    }

    coin(startingIndex, startingX, startingY) {
        if (this.toybox.currencyDisplay === null) {
            this.currencyDisplay();
        }
        var coinGO = this.toybox.game.add.sprite(startingX, startingY, "coins", startingIndex);
        coinGO.anchor.setTo(0.5, 0.5);
        this.toybox.game.physics.enable(coinGO);
        coinGO.body.collideWorldBounds = true;
        coinGO.name = "coin";
        coinGO.update = function () {};
        coinGO.currencyValue = this.currencyValueForIndex(startingIndex);
        coinGO.body.onCollide = new Phaser.Signal();
        coinGO.body.onCollide.add(this.tryIncreaseCurrency, this);
        this.toybox.addCollectible(coinGO);
    }

    currencyValueForIndex(startingIndex) {
        if (startingIndex == 0) {
            return 1;
        } else if (startingIndex == 1) {
            return 10;
        } else if (startingIndex == 2) {
            return 100;
        }
    }

    bronzeCoin(startingX, startingY) {
        return this.coin(0, startingX, startingY);
    }

    silverCoin(startingX, startingY) {
        return this.coin(1, startingX, startingY);
    }

    goldCoin(startingX, startingY) {
        return this.coin(2, startingX, startingY);
    }

    tryIncreaseCurrency(coin, collidedSprite) {
        if (this.spriteIsPlayer(collidedSprite)) {
            var numCurrency = Number(collidedSprite.toybox.currencyDisplay.text);
            numCurrency += coin.currencyValue;
            collidedSprite.toybox.currencyDisplay.text = String(numCurrency);
            coin.destroy();
        }
    }

    spriteIsPlayer(sprite) {
        return sprite !== null && sprite.name === "player1";
    }

    currencyDisplay() {
        var style = {
            font: "16px New Courier",
            fill: "#ff0044",
            align: "left"
        };
        var textGO = game.add.text(10, 10, "0", style);
        this.toybox.currencyDisplay = textGO;
    }
}
