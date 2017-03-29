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



}

function update() {
    toybox.update();



}

// CHALLENGE:
// Can you duplicate this example and change it to a two-player game? What would you need to change?
