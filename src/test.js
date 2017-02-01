var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;
var cursors;
var playerXSize;
var myPlayer;
var myShroom;
var gos = []

function preload() {
    toybox = new Toybox(game);
    toybox.preload();
}

function create() {
    //toybox.create();
    var spriteName = color + "Alien";
    myPlayer = toybox.add.player(spriteName, 100, 100);
}

function update() {

    toybox.update();

    var diceRoll = Math.random() * 64
    // if (diceRoll <= 2) {
    //     gos.push(toybox.add.block("crate1", Math.random() * game.world.width, 0));
    // } else if (diceRoll > 63) {
    //     gos.push(toybox.add.mushroom("yellow", Math.random() * game.world.width, 0));
    // } else if (diceRoll > 62) {
    //     gos.push(toybox.add.mushroom("red", Math.random() * game.world.width, 0));
    // } else if (diceRoll > 61) {
    //     gos.push(toybox.add.mushroom("purple", Math.random() * game.world.width, 0));
    // } else if (diceRoll > 60) {
    //     gos.push(toybox.add.mushroom("blue", Math.random() * game.world.width, 0));
    // }
}
