var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update,
});
var toybox;

// setting up what toybox plugins we're going to use.

var settings = {
    gravity: 980,
    plugins: ["alien","backdrop","gem","fly","spikes","bullet","coin"]
};

function preload() {
    toybox = new Toybox(game, settings);
    toybox.preload();
}

function create() {
  toybox.create();

  // Adding a backdrop to our game. We're using the 'green' preset.

  backdrop = toybox.add.backdrop({ preset: "green" });

  // Setting a global variable to check to see if the game has ended.

  isGameOver = false;

  // Setting up and creating our 'alien' player

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

    // Creating a Phaser text object to display our player's score
    // toybox.add.text works exactly like Phaser's game.add.text, but layers it on top of our toybox objects.

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

    // Creating a function that fire a bullet above player 1

    function player1Fire(){
    	// We're using Phaser's clamp function to limit the possible values of the x and y speed.
    	var dX = Phaser.Math.clamp((320 - player1.x)*3,-640,640);
    	var dY = Phaser.Math.clamp((-640 + Math.abs(dX)),-640,0);
    	// The direction of the bullet is determined by how far away from the center the player is.
    	// Being very far away from the center means a low angle in the opposite direction.
    	// So, very far away -> low y speed, high x speed in opposite direction.

    	// The bullet is created directly above the player's head, and cannot hit the player.
        var bulletOptions = {
            startingX: player1.x,
            startingY: player1.y - 24,
            speedVector: new Phaser.Point(dX,dY),
            hitPlayers: false
        }
        // Only create the bullet if the game isn't over.
        if (!isGameOver){
        	toybox.add.bullet(bulletOptions);
        }
    };

    // Adding the player1Fire function to Phaser's built in timer.
    // The function loops on repeat every 250 milliseconds (4 times per second)

    game.time.events.loop(250, player1Fire, this);

    // Creating a spikes-block at the bottom-left of the screen.

    spikes = toybox.add.spikes({startingX: 8, startingY: 474, color: "blue" });

    // This spikes-block will move back and forth along the bottom.
    // It will move at a speed of 50, starting headed right.
    // (This spikes-block is to force the player to move.)

    spikes.xDir = 50;

    // canTurnAround is a method of de-bouncing.
    // Basically, we don't want the spikes-block to get stuck in a loop where it constantly tries to turn around.
    // Every time it turns around, a half-second timer will set set before it can turn around again.

    spikes.canTurnAround = true;

    // Adding an update function to our spikes-block so it can move.

    spikes.update = function(){
    	this.body.velocity.x = this.xDir;

    	// The spikes-block will attempt to turn around if it hits another sprite or the edge of the game, and if it is allowed.
    	var bumped = (this.body.touching.right || this.body.touching.left);
    	var edges = ((this.x + this.width/2) >= this.toybox.game.width) || ((this.x - this.width/2) <= 0)
    	if ((bumped || edges) && (this.canTurnAround)){
    		// It spikes-block flips directions, moving at the same speed.
    		this.xDir *= -1;
    		// It's not allowed to turn around anymore.
    		this.canTurnAround = false;
    		var thisSpikes = this;
    		// We add an event to Phaser's timer that will allow the spikes-block to turn around in half a second.
            this.toybox.game.time.events.add(500, function(){ thisSpikes.canTurnAround = true; }, this);
    	}

    }
}

function update() {
    toybox.update();

    // Update the score text to reflect the player's current score.
    player1Score.setText("Score: " + player1.score);

    // As long as the game isn't over, randomly add some sprites.
    if (!isGameOver){

    	// toybox.oneOutOf is a quick randomizer function. It returns true one out of X times.

    	// One out of every 100 updates, create a new fly somewhere along the top of the game.
    	if(toybox.oneOutOf(100)){ 
    	    var newFly = toybox.add.fly({startingX: Phaser.Math.between(8,632), startingY: 8});
    	    // When this fly is killed, add 5 to the player's score.
    	    newFly.events.onKilled.addOnce(function(){player1.score += 5});
    	};
	
		// One out of every 250 updates, create a new coin somewhere along the top of the game, with a random horizontal speed.
    	if(toybox.oneOutOf(250)){ 
    	    toybox.add.coin({startingX: Phaser.Math.between(8,632), startingY: 8, dX: Phaser.Math.between(-50,50), dy: 0});
    	};

		// One out of every 700 updates, create a new gem somewhere along the bottom of the game in jumping reach of the player.
    	if(toybox.oneOutOf(700)){ 
    	    toybox.add.gem({startingX: Phaser.Math.between(8,632), startingY: Phaser.Math.between(400,456)});
    	};

    }

}

// CHALLENGE:
// Can you duplicate this example and change it to a two-player game? What would you need to change?
