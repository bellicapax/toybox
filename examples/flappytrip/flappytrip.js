var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;

// setting up what toybox plugins we're going to use.
// Also using a lower than normal gravity

var settings = {
    gravity: 400,
    plugins: ["bird","lava","spikes","gem","platform"]
};

function preload() {
    toybox = new Toybox(game, settings);
    toybox.preload();
}

 // Creating an empty array as a global variable to fill with player objects later

 var playersArray = [];

// setting up this function at a global scope to be accessed later.

function addPlayer(options){

	// setting a few defaults for our player objects

	options.startingY = 300;
	options.scale = 2;

	// creating a new 'bird'

	var newBird = toybox.add.bird(options);

	// attaching the color from the options object to the player object itself for use later

	newBird.color = options.color;

	// adding the player object to playersArray

	playersArray.push(newBird);

	// setting the player object's position based on how many other players there are

	var playerX = 260 - ((playersArray.length - 1) * 20) + (60 * playersArray.indexOf(newBird) );
	newBird.x = playerX;

	// returns the player object 

	return newBird;
}

function create() {
  toybox.create();

  // The game can handle multiple players.
  // (There are currently only 4 colors of bird sprites, but hypothetically more could be added)
  // Each player is given a color of sprite, which will also be used to identify their score
  // as well as a controls object that contains 'left' and 'right' with corresponding keycodes,
  // Players 3 and 4 are currently commented out.

  // Note that variables are defined here without using 'var'
  // Meaning these variables are 'hoisted' onto the global scope.

  player1 =  addPlayer({ color: "orange"});
  player2 =  addPlayer({ color: "blue", controls: { left:65, right:83}}); // controls: left "A", right "S"
  //player3 =  addPlayer({ color: "green", controls: { left:88, right:67}}); // controls: left "X", right "C"
  //player4 =  addPlayer({ color: "pink", controls: { left:65, right:68}});	// controls: left "M", right "<"

  // defining the lava object that spans the bottom of the game

  lava = toybox.add.lava( {startingX: 320, startingY: 480 - 8, width: game.width, height: 16, color: "green"});

  // defining a platform for players to start from.

  startPlatform = toybox.add.platform ({ startingX: 320, startingY: 364, type: 3, width: 128, height: 16});

  // After 7.5 seconds, run a function that begins scoring and removes the platform.
  // See function below.

  toybox.game.time.events.add( 7500, startScoring , this );

  // initScores creates the score objects for each player. See function below.

  initScores();
}

// destroys the starting platform and creates a loop that runs increasePlayerScores every 2 seconds.

function startScoring(){
	startPlatform.kill();
	toybox.game.time.events.loop( 2000, increasePlayerScores , this );
}

// increasePlayerScores runs through the playersArray and if that player is still alive (health > 0), increases their score by one.

function increasePlayerScores(){
	for (var i = playersArray.length - 1; i >= 0; i--) {
		if( playersArray[i].health > 0 ){
			playersArray[i].score++;
		}
	}
}

// initScores creates the text-objects that keep track of players' scores

function initScores(){

	// defines scoresArray as a global variable, it will hold all of the scores objects

	scoresArray = [];

	// loops through playersArray and creates a text object for each player, using their color and score

	for (var i = playersArray.length - 1; i >= 0; i--) {

		// determines where the score should sit on the screen depending on how many players are in the game.
		// (there's no real logic to these numbers, they were found by trial and error)

		var scoreX = 20 + (540 / (playersArray.length - 1) * i);

		var playerScoreObj = {
			player: playersArray[i],
			score: toybox.add.text(scoreX, 20, player1.color.toUpperCase() + ": " + player1.score, {
   			    fill: "#ffffff",
   			    align: "right",
   			    font: "bold 10pt Arial"
   			})
		}

		// pushes the new text-object into scoresArray

		scoresArray.push(playerScoreObj);

	}
};

// addNewSpike creates a new spike object, using only the y-position of the spikes as an argument

function addNewSpike(height){

	// a spike object is created off-screen to the left. 
	// Unlike most objects, it needs to be able to pass through the bounds of the world,

	var newSpikes = toybox.add.spikes({
		startingX: -24,
		startingY: height,
		color: "blue",
		collideWorld: false
	});

	// overwrites the spikes update function to move it constantly to the right.
	// If the spike moves of the screen, it is destroyed.

	newSpikes.update = function(){
		this.body.velocity.x = 50;
		if (this.x > (this.game.width + this.width)){
			this.kill();
		}
	}
}

// addNewSpikeLine adds a line of spikes
// the number of spikes in the line, the y-position of the first spike, the the change in y between spikes, and the frequency of spikes are arguments

function addNewSpikeLine(totalSpikes, startingY, dY, timer){
	// loops through the total number of spikes

	for (var counter = 0; counter < totalSpikes; counter++) {

		// the y-position of the new spike is based on the initial y-position, the change in y, and which spike this one is.
		var newHeight = (counter * dY) + startingY;
		// sets a timer to create a new spike after a multiple of the timer provided has passed.
		// IE: If timer == 2000, it creates the first spike in 0 seconds, the second in 2 seconds, and the third in 4.
		toybox.game.time.events.add( 0 + (counter * timer), function(newHeight){
			addNewSpike( newHeight );
		}, this, newHeight);
	}
}

// addNewGem adds a gem, using only the y-position of the spikes as an argument

function addNewGem(height){
	// creates a new gem offscreen.
	var newGem = toybox.add.gem({
		startingX: -24,
		startingY: height,
		collideWorld: false
	});
	// sets the gem-objects score value to 10
	newGem.currencyValue = 10;
	//moves it offscreen just like the spikes
	// this probably should be refactored into a new function, but meh.
	newGem.update = function(){
		this.body.velocity.x = 50;
		if (this.x > (this.game.width + this.width)){
			this.kill();
		}
	}
}

function update() {
    toybox.update();

    // loops through the scoresArray and sets the text of each score to reflect the player's current score

    for (var i = scoresArray.length - 1; i >= 0; i--) {
    	scoreObj = scoresArray[i];
    	scoreObj.score.setText(scoreObj.player.color.toUpperCase() + ": "+ scoreObj.player.score)
    }

    // One out of every 350 update cycles, creates a line of 3-6 spikes near the middle of the game.

    if(toybox.oneOutOf(350)){ 
        addNewSpikeLine(Phaser.Math.between(3,6),Phaser.Math.between(60,400),Phaser.Math.between(-10,10)*3,Phaser.Math.between(250,1500));
    };

    // One out of every 200 update cycles, creates a line of 1-2 spikes with a slightly wider possible range.

    if(toybox.oneOutOf(200)){ 
        addNewSpikeLine(Phaser.Math.between(1,2),Phaser.Math.between(30,430),Phaser.Math.between(-10,10)*3,Phaser.Math.between(250,1500));
    };

     // One out of every 125 update cycles, creates one spike pretty much anywhere.

    if(toybox.oneOutOf(125)){ 
        addNewSpike(Phaser.Math.between(0,460));
    };

     // One out of every 400 update cycles, creates a gem pretty much anywhere.

    if(toybox.oneOutOf(400)){ 
        addNewGem(Phaser.Math.between(10,435));
    };
}
