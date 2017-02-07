var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;
var settings = {gravity: 980};

function preload() {
    toybox = new Toybox(game,settings);
    toybox.preload();
}

function create() {

    var playerOptions = {
        startingX : 100,
        startingY: 100,
        color: "blue",
        jumpForce: 300,
        speed: 100,
        scale: 1
    }

    player = toybox.add.player(playerOptions);

    toybox.add.mushroom({
    	startingX: 50,
    	startingY: 0,
    	color: "red"
    });

    toybox.add.coin({
        startingX: 200,
        startingY: 0,
        color: "gold"
    });
    toybox.add.coin({
        startingX: 250,
        startingY: 0,
        color: "silver"
    });
    toybox.add.coin({
        startingX: 300,
        startingY: 0,
        color: "bronze"
    });

    toybox.add.crate({
        startingX: 400,
        startingY: 0
    });
}

function update() {
    toybox.update();
}
