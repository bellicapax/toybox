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
        this.toybox.game.physics.enable(playerGO);
        playerGO.body.collideWorldBounds = true;
        this.addAnimationsToPlayer(playerGO);
        playerGO.toybox = this.toybox;
        playerGO.update = this.playerPlatformerUpdate;
        this.toybox.addGameObject(playerGO);
        return playerGO;
    }

    playerPlatformerUpdate() {
        // Get cursor status
        // Compare to last frame
        // If different, do something
        if (cursors.right.isDown) {
            this.body.velocity.x = speed;
            if (this.scale.x < 0) {
                this.scale.x *= -1;
            }
            if (this.animations.name !== "run") {
                this.animations.play("run");
            }
        } else if (cursors.left.isDown) {
            this.body.velocity.x = -speed;
            if (this.scale.x > 0) {
                this.scale.x *= -1;
            }
            if (this.animations.play("run")) {
                this.animations.play("run");
            }
        } else {
            // Not moving
            this.body.velocity.x = 0;
            this.animations.play("idle");
        }

        if (spacebar.isDown) {
            this.body.velocity.y = -100;
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
        player.animations.add("run", [9, 10], fps, true);
        player.animations.add("jump", [7, 8], fps, true);
    }
}
