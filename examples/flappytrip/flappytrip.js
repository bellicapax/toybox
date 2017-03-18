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

  lava = toybox.add.lava( {startingX: 320, startingY: 480 - 8, width: game.width, height: 16, color: "green"});

  startPlatform = toybox.add.platform ({ startingX: 320, startingY: 364, type: 3, width: 128, height: 16});
  toybox.game.time.events.add( 5000, function(){startPlatform.kill()} , this )

  globalSpikesColor = "blue";
  isGameOver = false;
}

function update() {
    toybox.update();

    // for (var i = playersArray.length - 1; i >= 0; i--) {
    // 	playersArray[i].score.setText(playersArray[i].color.toUpperCase() + ": "+ playersArray[i].sprite.score)
    // }

    if(toybox.oneOutOf(100)){ 
        addNewSpikeLine(Phaser.Math.between(0,6),Phaser.Math.between(0,460),Phaser.Math.between(-10,10)*3,Phaser.Math.between(250,1500));
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

function addPlayer(options){

	var playerScoreObject = {};

	playersArray.push(playerScoreObject);

	var scoreX = 20 + (550 / playersArray.length * playersArray.indexOf(playerScoreObject));
	var playerX = 320 - (playersArray.length * 20) + (40 * playersArray.indexOf(playerScoreObject) );
	options.startingX = playerX;
	options.startingY = 300;
	options.scale = 2;

	playerScoreObject = {
		//score: toybox.add.text(scoreX, 20, options.color.toUpperCase() + ": " , {
        //	fill: "#ffffff",
        //	align: "right",
        //	font: "bold 10pt Arial"
    	//}),
    	sprite: toybox.add.bird(options),
    	color: options.color
	}

	return playerScoreObject;
}