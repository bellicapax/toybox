var fanToyboxPlugin = {
    name: "fan",
    toyboxType: "block",
    preload: function (toyboxObject) {
        toyboxObject._game.load.spritesheet("fan", "../../assets/sprites/fan.png", 32, 16);
    },
    create: function (fanOptions) {
        fanOptions.height = fanOptions.height || 100;
        fanOptions.blowStrength = fanOptions.blowStrength || 50;
        fanOptions.spriteName = "fan";

        var blowObjects = function() {
            gos = this.toybox.currentGameObjects;
            var blowRect = new Phaser.Rectangle(this.x - this.width * 0.5, this.y - this.blowHeight - this.height * 0.5, this.width, this.blowHeight);
            for (var i = 0; i < gos.length; i++) {
                if (blowRect.contains(gos[i].x, gos[i].y)) {
                    var normalizedDir = new Phaser.Point(0, -1);
                    var dist = Phaser.Math.distance(this.x, this.y, gos[i].x, gos[i].y);
                    var distanceModifier = Phaser.Math.linear(1, 0.25, dist / blowRect.height);
                    gos[i].body.velocity.x += normalizedDir.x * this.blowStrength * distanceModifier;
                    gos[i].body.velocity.y += normalizedDir.y * this.blowStrength * distanceModifier;
                }
            }
            if(fanOptions.draw){
              this.graphics.clear();
              this.graphics.beginFill(0xffffff);
              this.graphics.drawRect(blowRect.x, blowRect.y, blowRect.width, blowRect.height);
            }
        }
        fanOptions.update = blowObjects;
        var fanGO = this.toybox.add.toyboxObject(fanOptions);
        fanGO.blowHeight = fanOptions.height;
        fanGO.blowStrength = fanOptions.blowStrength;
        fanGO.animations.add("blow", [0,1,2,3], 24, true);
        fanGO.animations.play("blow");
        if(fanOptions.draw){
          fanGO.graphics = this.toybox.game.add.graphics(0,0);
        }
        return fanGO;
    }
};
