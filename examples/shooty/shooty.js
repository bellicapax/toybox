var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update,
});
var toybox;
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

  backdrop = toybox.add.backdrop({ preset: "green" });

  isGameOver = false;

  var playerOptions = {
        startingX : 320,
        startingY: 470,
        color: "pink",
        jumpForce: 450,
        speed: 150,
        scale: 1,
        health: 1
    }

    player1 = toybox.add.alien(playerOptions);

    playerScore = toybox.add.text(20, 20, "Score: " + player1.score, {
        fill: "#ffffff",
        align: "right",
        font: "bold 10pt Arial"
    });

    function runGameOver(){
    	isGameOver = true;
    	var gameOverBanner = toybox.add.text(320, 240, "Game Over", {
        	fill: "#ffffff",
        	align: "center",
    	});
    	gameOverBanner.anchor.setTo(0.5);
    };

    player1.events.onKilled.addOnce(runGameOver);

    game.time.events.loop(250, player1Fire, this);

    function player1Fire(){
    	var dX = Phaser.Math.clamp((320 - player1.x)*3,-640,640);
    	var dY = Phaser.Math.clamp((-640 + Math.abs(dX)),-640,0);
        var bulletOptions = {
            startingX: player1.x,
            startingY: player1.y - 24,
            speedVector: new Phaser.Point(dX,dY),
            hitPlayers: false
        }
        if (!isGameOver){
        	toybox.add.bullet(bulletOptions);
        }
    };

    spikes = toybox.add.spikes({startingX: 8, startingY: 474, color: "blue" });

    spikes.xDir = 50;
    spikes.canTurnAround = true;
    spikes.update = function(){
    	this.body.velocity.x = this.xDir;
    	var bumped = (this.body.touching.right || this.body.touching.left);
    	var edges = ((this.x + this.width/2) >= this.toybox.game.width) || ((this.x - this.width/2) <= 0)
    	if ((bumped || edges) && (this.canTurnAround)){
    		this.xDir *= -1;
    		this.canTurnAround = false;
    		var thisSpikes = this;
            this.toybox.game.time.events.add(500, function(){ thisSpikes.canTurnAround = true; }, this);
    	}

    }
}

function update() {
    toybox.update();

    playerScore.setText("Score: " + player1.score);

    if (!isGameOver){

    	if(toybox.oneOutOf(100)){ 
    	    var newFly = toybox.add.fly({startingX: Phaser.Math.between(8,632), startingY: 8});
    	    newFly.events.onKilled.addOnce(function(){player1.score += 5});
    	};
	
    	if(toybox.oneOutOf(250)){ 
    	    toybox.add.coin({startingX: Phaser.Math.between(8,632), startingY: 8, dX: Phaser.Math.between(-50,50), dy: 0});
    	};
	
    	if(toybox.oneOutOf(700)){ 
    	    toybox.add.gem({startingX: Phaser.Math.between(8,632), startingY: Phaser.Math.between(400,456)});
    	};

    }

}
