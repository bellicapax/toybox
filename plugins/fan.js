var fanToyboxPlugin = {
    name: "fan",
    toyboxType: "block",
    preload: function (toyboxObject) {
      toyboxObject._game.load.spritesheet("fan", "../../assets/sprites/fan.png", 16, 32);
    },
    create: function (fanOptions) {

    }
};
