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
    toybox.create();
    myPlayer = toybox.add.player("greenAlien", 100, 100);
    myShroom = toybox.add.collectible("purpleMushroom", 200, 0);
    gos.push(myPlayer);
    gos.push(myShroom);
    // toybox.createPlayer("greenAlien", 50, 50);
    // toybox.createPlayer("blueFly", 150, 50);
}


function update() {
    toybox.update();
    var diceRoll = Math.random() * 64
    if (diceRoll >= 63) {
        gos.push(toybox.add.collectible("purpleMushroom", Math.random() * game.world.width, 0));
    }
    if (diceRoll <= 2) {
        gos.push(toybox.add.block("crate1", Math.random() * game.world.width, 0));
    }
    // game.physics.arcade.collide(myPlayer, myShroom);
    game.physics.arcade.collide(gos, gos);
}
