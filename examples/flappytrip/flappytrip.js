var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;
var settings = {
    gravity: 400,
    plugins: ["bird","lava","spikes","gem"]
};

function preload() {
    toybox = new Toybox(game, settings);
    toybox.preload();
}

function create() {
  toybox.create();

  bird1 =  toybox.add.bird({startingX:320, startingY: 400, color: "orange", scale: 2});
  spikes =  toybox.add.spikes({startingX:400, startingY: 300, color: "blue", scale: 1});
}

function update() {
    toybox.update();
}
