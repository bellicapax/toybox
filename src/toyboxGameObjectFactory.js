class ToyboxGameObjectFactory {
    constructor(toybox) {
        this.toybox = toybox;
        this.playerGO = null;
    }

    player(spritesheetName, startingX, startingY) {
        var playerGO = this.playerGO;
        if (playerGO != null) {
            playerGO.destroy();
        }
        playerGO = this.toybox.game.add.sprite(startingX, startingY, spritesheetName, 1);
        playerGO.anchor.setTo(0.5, 0.5);
        this.addAnimationsToPlayer(playerGO);
        playerGO.toybox = this.toybox;
        playerGO.update = this.playerPlatformerUpdate;
        this.toybox.addGameObject(playerGO);
        return playerGO;
    }

    playerPlatformerUpdate() {

        if (cursors.right.isDown) {
            this.x += speed;
        } else if (cursors.left.isDown) {
            this.x -= speed;
        }
        // checkForJump
    }

    playerOrthagonalUpdate() {
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
    }

    addAnimationsToPlayer(player) {
        var fps = this.toybox.animationFPS;
        player.animations.add("idle", [1]);
        player.animations.add("walk", [9, 10], fps, true);
        player.animations.add("jump", [7, 8], fps, true);
    }
}
