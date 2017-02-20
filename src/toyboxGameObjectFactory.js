
class ToyboxGameObjectFactory {
    constructor(toybox) {
        this.toybox = toybox;
        //this.playerGO = null;
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
        playerGO.update = playerOptions.update;
        playerGO.stats = {};
        playerGO.jumpForce = playerOptions.jumpForce;
        this.playerAttachControls(playerGO,playerOptions.controls);
        this.toybox.addPlayer(playerGO);
        return playerGO;
    }

    playerAttachControls(playerGO,controlsObject){
        playerGO.controls = {};
        if (typeof(controlsObject) == "undefined"){
            return;
        }
        for (var i = Object.keys(controlsObject).length - 1; i >= 0; i--) {
            var controlName = Object.keys(controlsObject)[i];
            playerGO.controls[controlName] = this.toybox.game.input.keyboard.addKey(controlsObject[controlName]);
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

    // var collectibleOptions = {
    //     spriteName: "spriteSheet",
    //     spriteIndex: 0,
    //     startingX: 0,
    //     startingY: 0,
    //     bounce: 0,
    //     update: function(){},
    //     collide: function(){}
    // };

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

}
