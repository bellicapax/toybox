
class ToyboxGameObjectFactory {
    constructor(toybox) {
        this.toybox = toybox;
        this.playerGO = null;
    }

    toyboxObject(objectOptions){
        objectOptions.spriteIndex = objectOptions.spriteIndex || 0;
        objectOptions.bounce = objectOptions.bounce || 0;
        objectOptions.scale = objectOptions.scale || 1;
        objectOptions.drag = objectOptions.drag || 200;
        objectOptions.allowGravity = objectOptions.allowGravity || true;

        var objectGO = this.toybox.game.add.sprite(objectOptions.startingX, objectOptions.startingY, objectOptions.spriteName, objectOptions.spriteIndex);
        
        objectGO.scale.x = objectOptions.scale;
        objectGO.scale.y = objectOptions.scale;
        objectGO.anchor.setTo(0.5, 0.5);

        this.toybox.game.physics.enable(objectGO);
        if (typeof(objectOptions.dX) !== "undefined") {
            objectGO.body.velocity.x = objectOptions.dX;
        }
        if (typeof(objectOptions.dy) !== "undefined") {
            objectGO.body.velocity.y = objectOptions.dy;
        }
        objectGO.body.collideWorldBounds = true;
        objectGO.body.bounce.set(objectOptions.bounce);
        objectGO.body.allowGravity = objectOptions.allowGravity;

        objectGO.name = objectOptions.name;
        objectGO.update = (typeof(objectOptions.update) == "function") ? objectOptions.update : function(){};
        if (typeof(objectOptions.collide) == "function"){
            objectGO.body.onCollide = new Phaser.Signal();
            objectGO.body.onCollide.add(objectOptions.collide, toybox);
        }
        objectGO.toybox = this.toybox;
        return objectGO;
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
        playerOptions.name = "player1";

        // var playerGO = this.playerGO;
        // if (playerGO != null) {
        //     playerGO.destroy();
        // }

        playerOptions.spriteName = playerOptions.color + "Alien";
        var playerGO = this.toybox.add.toyboxObject(playerOptions);

        playerGO.speed = playerOptions.speed;
        playerGO.update = this.playerPlatformerUpdate;
        this.addAnimationsToPlayer(playerGO);
        playerGO.jumpForce = playerOptions.jumpForce;
        this.toybox.addPlayer(playerGO);
        return playerGO;
    }

    alienPlayer(alienOptions) {
        alienOptions.allowGravity = true;
        var validColors = ["green","blue","pink"];
        if (typeof(alienOptions.color) == "undefined" || validColors.indexOf(alienOptions.color) == -1){
            alienOptions.color = "green";
        }
        alienOptions.spriteName = alienOptions.color + "Alien";
        var alienGO = this.toybox.add.player(alienOptions);
        return alienGO;
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

    // var collectibleOptions = {
    //     spriteName: "spriteSheet",
    //     spriteIndex: 0,
    //     startingX: 0,
    //     startingY: 0,
    //     bounce: 0,
    //     update: function(){},
    //     collide: function(){}
    // };

    collectible(collectibleOptions) {
        collectibleOptions.spriteIndex = collectibleOptions.spriteIndex || 0;
        collectibleOptions.bounce = collectibleOptions.bounce || 0;
        collectibleOptions.scale = collectibleOptions.scale || 1;
        collectibleOptions.drag = collectibleOptions.drag || 200;

        var collectibleGO = this.toybox.add.toyboxObject(collectibleOptions);
        
        collectibleGO.toyboxType = "collectible";
        this.toybox.addCollectible(collectibleGO);
        return collectibleGO;
    }

    mushroom(mushroomOptions){

        var randomizeShroom = function() {
            var probability = toybox.diceRoll(40);
            if (probability <= 10) {
                return "red";
            } else if (probability <= 20){
                return "yellow";
            } else if (probability <= 30){
                return "blue";
            } else {
                return "purple";
            }
        }

        mushroomOptions.color = mushroomOptions.color || randomizeShroom();
        mushroomOptions.spriteName = "smallMushrooms";
        mushroomOptions.name = mushroomOptions.color + "Mushroom";
        switch (mushroomOptions.color){
            case "yellow":
                mushroomOptions.spriteIndex = 14;
                mushroomOptions.collide = this.trySpeedUpPlayer;
            break;
            case "red":
                mushroomOptions.spriteIndex = 11;
                mushroomOptions.collide = this.trySlowPlayer;
            break;
            case "blue":
                mushroomOptions.spriteIndex = 20;
                mushroomOptions.collide = this.tryShrinkPlayer;
            break;
            default:
                mushroomOptions.spriteIndex = 20;
                mushroomOptions.collide = this.tryGrowPlayer;
            break;
        }
        var mushroomGO = this.toybox.add.collectible(mushroomOptions);
        return mushroomGO;
    }

    tryGrowPlayer(sprite1, sprite2) {
        if (sprite2 !== null && sprite2.name === "player1") {
            var playerGO = sprite2;
            if (playerGO.scale.x <= 3.0){
                var tempSize = Math.abs(playerGO.scale.x)
                var newSize = tempSize + 0.25;
                var scaleBy = (newSize / tempSize);
                playerGO.scale.x *= scaleBy;
                playerGO.scale.y *= scaleBy;
            }
            sprite1.destroy();
        }
    }

    tryShrinkPlayer(sprite1, sprite2) {
        if (sprite2 !== null && sprite2.name === "player1") {
            var playerGO = sprite2;
            if (playerGO.scale.x <= 3.0){
                var tempSize = Math.abs(playerGO.scale.x)
                var newSize = tempSize - 0.25;
                var scaleBy = (newSize / tempSize);
                playerGO.scale.x *= scaleBy;
                playerGO.scale.y *= scaleBy;
            }
            sprite1.destroy();
        }
    }

    trySpeedUpPlayer(sprite1, sprite2) {
        if (sprite2 !== null && sprite2.name === "player1") {
            var playerGO = sprite2;
            if (playerGO.speed <= 300){
                playerGO.speed += 50;
            }
            sprite1.destroy();
        }
    }

    trySlowPlayer(sprite1, sprite2) {
        if (sprite2 !== null && sprite2.name === "player1") {
            var playerGO = sprite2;
            if (playerGO.speed >= 100){
                playerGO.speed -= 50;
            }
            sprite1.destroy();
        }
    }

    // var collectibleOptions = {
    //     spriteName: "spriteSheet",
    //     spriteIndex: 0,
    //     startingX: 0,
    //     startingY: 0,
    //     bounce: 0,
    //     update: function(){},
    //     collide: function(){}
    // };

    coin(coinOptions) {

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
        coinOptions.collide = this.tryIncreaseCurrency;
        if (this.toybox.currencyDisplay === null) {
            this.currencyDisplay();
        }
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

    // bronzeCoin(startingX, startingY) {
    //     return this.coin(0, startingX, startingY);
    // }

    // silverCoin(startingX, startingY) {
    //     return this.coin(1, startingX, startingY);
    // }

    // goldCoin(startingX, startingY) {
    //     return this.coin(2, startingX, startingY);
    // }

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

    block(blockOptions) {
        blockOptions.spriteIndex = blockOptions.spriteIndex || 0;
        blockOptions.bounce = blockOptions.bounce || 0;
        blockOptions.scale = blockOptions.scale || 1;
        blockOptions.drag = blockOptions.drag || 500;

        var blockGO = this.toybox.add.toyboxObject(blockOptions);
        blockGO.toyboxType = "block";
        this.toybox.addBlock(blockGO);
        return blockGO;
    }

    crate(crateOptions){
        crateOptions.spriteName = "cratesAndOre";
        crateOptions.scale = crateOptions.scale || this.toybox.diceRoll(4);
        crateOptions.spriteIndex = crateOptions.type || this.toybox.diceRoll(4) - 1;
        crateOptions.name = "type" + crateOptions.type + "Crate";
        crateOptions.drag = (crateOptions.scale ^ 2) * 50;
        var crateGO = this.toybox.add.block(crateOptions);
        return crateGO;
    }
}
