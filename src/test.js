var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var cursors;
var playerXSize;

function preload() {
	game.load.spritesheet("greenie", "assets/sprites/greenAlienSheet.png", 16, 20);

}

function create() {
	createPlayer("greenie", game.world.centerX, game.world.centerY);
	playerXSize = 5;
	var toybox = new Toybox(game);
	toybox.logSuzy();
}



function update() {
}
