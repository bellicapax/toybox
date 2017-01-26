var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var toybox;
var cursors;
var playerXSize;

function preload() {
	toybox = new Toybox(game);
	toybox.preload();
}

function create() {
	toybox.create();
	toybox.createPlayer("greenAlien", 50, 50);
	toybox.createPlayer("blueFly", 150, 50);
}


function update() {
	toybox.update();
}
