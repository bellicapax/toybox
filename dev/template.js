var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;
var settings = {
    gravity: 980
};

function preload() {
    toybox = new Toybox(game, settings);
    toybox.preload();
}

function create() {

}

function update() {
    toybox.update();
}
