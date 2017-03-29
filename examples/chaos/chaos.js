var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update,
});
var toybox;

// setting up what toybox plugins we're going to use.

var settings = {
    gravity: 980,
    plugins: ["alien","backdrop","gem","fly","multibrick","bullet","coin","bubble","fan"]
};

function preload() {
    toybox = new Toybox(game, settings);
    toybox.preload();
}

function create() {
  toybox.create();

  backdrop = toybox.add.backdrop({ preset: "spring" });


  isGameOver = false;


  var player1Options = {
        startingX : 320,
        startingY: 470,
        color: "pink",
        jumpForce: 500,
        speed: 150,
        scale: 1,
        health: 1
    }

    player1 = toybox.add.alien(player1Options);

    player1Score = toybox.add.text(20, 20, "Score: " + player1.score, {
        fill: "#ffffff",
        align: "right",
        font: "bold 10pt Arial"
    });

    // Creating a function to run when the game ends.
    // This functions sets the global isGameOver variable and creates a new text object.

    function runGameOver(){
    	isGameOver = true;
    	var gameOverBanner = toybox.add.text(320, 240, "Game Over", {
        	fill: "#ffffff",
        	align: "center",
    	});
    	gameOverBanner.anchor.setTo(0.5);
    };

    // adding runGameOver to our player1's onKilled Signal. When that player is killed, the game ends.

    player1.events.onKilled.addOnce(runGameOver);

    var fanOptions = {
        startingX: game.world.centerX,
        startingY: game.world.centerY,
        allowGravity: false,
        immovable: true,
        height: 500,
        blowStrength: 10
    }

    centerFan = toybox.add.fan(fanOptions);
    centerFan.rotation = Math.PI;
    centerRing = newBrickRing( new Phaser.Point ( game.world.centerX, game.world.centerY), 100);

    fanOptions.startingX = game.world.centerX * 0.5;
    leftFan = toybox.add.fan(fanOptions);

    fanOptions.startingX = game.world.centerX * 1.5;
    rightFan = toybox.add.fan(fanOptions);

    bubbleSpawnPoints = [game.width * 0.125, game.width * 0.375, game.width * 0.625, game.width * 0.825];


}

function rotateRight(object){
    object.rotation += 0.01;
    if (object.children.length > 0) {
        for (var i = object.children.length - 1; i >= 0; i--) {
            object.children[i].rotateLeft();
        }
    }
}
function rotateLeft(object){
    object.rotation -= 0.01;
    if (object.children.length > 0) {
        for (var i = object.children.length - 1; i >= 0; i--) {
            object.children[i].rotateRight();
        }
    }
}

function spawnBubble(x){
    var bubbleOptions = {
        startingY: game.height,
        startingX: x + Phaser.Math.between(-16,16),
        maxScale: Phaser.Math.between(2,5),
        dY: -250
    }
    return toybox.add.bubble(bubbleOptions)
}

function newBrickRing(point,distance){
    var ring = new Phaser.Group(game,toybox.blocks);
    ring.addChild( toybox.add.multibrick({
        startingX: point.x - distance,
        startingY: point.y,
        type: "striped"
    }));
    ring.addChild( toybox.add.multibrick({
        startingX: point.x,
        startingY: point.y - distance,
        type: "striped"
    }));
    ring.addChild( toybox.add.multibrick({
        startingX: point.x + distance,
        startingY: point.y,
        type: "striped"
    }));
    ring.addChild( toybox.add.multibrick({
        startingX: point.x,
        startingY: point.y + distance,
        type: "striped"
    }));
    return ring;
}

function update() {
    toybox.update();

    rotateLeft(centerFan);
    rotateRight(leftFan);
    rotateRight(rightFan);

    if (toybox.oneOutOf(25)){
        spawnBubble(bubbleSpawnPoints[Phaser.Math.between(0,3)]);
    }

}

// CHALLENGE:
// Can you duplicate this example and change it to a two-player game? What would you need to change?
