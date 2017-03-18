var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;
var settings = {
    gravity: 400,
    plugins: ["bird","lava","spikes","gem","platform"]
};

function preload() {
    toybox = new Toybox(game, settings);
    toybox.preload();
}

function create() {
  toybox.create();

  playersArray = [];

  player1 =  addPlayer({ color: "orange"});
  player2 =  addPlayer({ color: "blue", controls: { left:65, right:83}}); // controls: left "A", right "S"
  //player3 =  addPlayer({ color: "green", controls: { left:88, right:67}}); // controls: left "X", right "C"
  //player4 =  addPlayer({ color: "pink", controls: { left:65, right:68}});	// controls: left "M", right "<"

  lava = toybox.add.lava( {startingX: 320, startingY: 480 - 8, width: game.width, height: 16, color: "green"});

  startPlatform = toybox.add.platform ({ startingX: 320, startingY: 364, type: 3, width: 128, height: 16});
  toybox.game.time.events.add( 5000, startScoring , this );

  globalSpikesColor = "blue";
  isGameOver = false;
  initScores();
}

function update() {
    toybox.update();

    for (var i = scoresArray.length - 1; i >= 0; i--) {
    	scoreObj = scoresArray[i];
    	scoreObj.score.setText(scoreObj.player.color.toUpperCase() + ": "+ scoreObj.player.score)
    }

    if(toybox.oneOutOf(300)){ 
        addNewSpikeLine(Phaser.Math.between(3,6),Phaser.Math.between(60,400),Phaser.Math.between(-10,10)*3,Phaser.Math.between(250,1500));
    };

    if(toybox.oneOutOf(150)){ 
        addNewSpikeLine(Phaser.Math.between(1,2),Phaser.Math.between(30,430),Phaser.Math.between(-10,10)*3,Phaser.Math.between(250,1500));
    };

    if(toybox.oneOutOf(75)){ 
        addNewSpike(Phaser.Math.between(0,460));
    };

    if(toybox.oneOutOf(500)){ 
        addNewGem(Phaser.Math.between(10,435));
    };
}

function addNewSpikeLine(totalSpikes, startingY, dY, timer){
	for (var counter = 0; counter < totalSpikes; counter++) {
		var newHeight = (counter * dY) + startingY;
		toybox.game.time.events.add( 0 + (counter * timer), function(newHeight){
			addNewSpike( newHeight );
		}, this, newHeight);
	}
}

function addNewSpike(height){
	var newSpikes = toybox.add.spikes({
		startingX: -24,
		startingY: height,
		color: globalSpikesColor,
		collideWorld: false
	});
	newSpikes.update = function(){
		this.body.velocity.x = 50;
		if (this.x > (this.game.width + this.width)){
			this.kill();
		}
	}
}

function addNewGem(height){
	var newGem = toybox.add.gem({
		startingX: -24,
		startingY: height,
		collideWorld: false
	});
	newGem.currencyValue = 10;
	newGem.update = function(){
		this.body.velocity.x = 50;
		if (this.x > (this.game.width + this.width)){
			this.kill();
		}
	}
}

function addPlayer(options){

	options.startingY = 300;
	options.scale = 2;

	var newBird = toybox.add.bird(options);

	newBird.color = options.color;
	playersArray.push(newBird);

	var playerX = 260 - ((playersArray.length - 1) * 20) + (60 * playersArray.indexOf(newBird) );
	newBird.x = playerX;

	return newBird;
}

function initScores(){
	scoresArray = [];

	for (var i = playersArray.length - 1; i >= 0; i--) {

		var scoreX = 20 + (540 / (playersArray.length - 1) * i);

		var playerScoreObj = {
			player: playersArray[i],
			score: toybox.add.text(scoreX, 20, player1.color.toUpperCase() + ": " + player1.score, {
   			    fill: "#ffffff",
   			    align: "right",
   			    font: "bold 10pt Arial"
   			})
		}

		scoresArray.push(playerScoreObj);

	}
};

function increasePlayerScores(){
	for (var i = playersArray.length - 1; i >= 0; i--) {
		if( playersArray[i].health > 0 ){
			playersArray[i].score++;
		}
	}
}

function startScoring(){
	startPlatform.kill();
	toybox.game.time.events.loop( 2000, increasePlayerScores , this );
}