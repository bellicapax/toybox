var fanToyboxPlugin = {
    name: "fan",
    toyboxType: "block",
    preload: function (toyboxObject) {
        toyboxObject._game.load.spritesheet("fan", "../../assets/sprites/fan.png", 32, 16);
    },
    create: function (fanOptions) {
        fanOptions.height = fanOptions.height || 64;
        fanOptions.blowStrength = fanOptions.blowStrength || 50;
        fanOptions.spriteName = "fan";

        var blowObjects = function() {
            gos = this.toybox.currentGameObjects;
            for (var i = 0; i < gos.length; i++) {
                if (this.blowRect.contains(gos[i].x, gos[i].y)) {
                    var normalizedDir = new Phaser.Point(0, -1);
                    var dist = Phaser.Math.distance(this.x, this.y, gos[i].x, gos[i].y);
                    var distanceModifier = Phaser.Math.linear(1, 0.25, dist / this.blowRect.height);
                    gos[i].body.velocity.x += normalizedDir.x * this.blowStrength * distanceModifier;
                    gos[i].body.velocity.y += normalizedDir.y * this.blowStrength * distanceModifier;
                }
            }
        }
        fanOptions.update = blowObjects;
        var fanGO = this.toybox.add.toyboxObject(fanOptions);
        fanGO.blowRect = new Phaser.Rectangle(fanGO.x - fanGO.width * 0.5, fanGO.y - fanOptions.height - fanGO.height * 0.5, fanGO.width, fanOptions.height);
        fanGO.blowStrength = fanOptions.blowStrength;
        fanGO.animations.add("blow", [0,1,2,3], 24, true);
        fanGO.animations.play("blow");
        if(fanOptions.draw){
          var g = this.toybox.game.add.graphics(0,0);
          g.beginFill(0xffffff);
          g.drawRect(fanGO.blowRect.x, fanGO.blowRect.y, fanGO.blowRect.width, fanGO.blowRect.height);
        }
        return fanGO;
    }
};
