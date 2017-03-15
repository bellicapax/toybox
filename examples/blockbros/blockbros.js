var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;
var settings = {
    gravity: 980,
    plugins: ["crate","coin","mushroom","alien","backdrop","gem","slime","platform","spring","button","fly","lever","fireball","jelly","lava","spikes","multibrick"]
};

function preload() {
    toybox = new Toybox(game, settings);
    toybox.preload();
    toybox._game.load.spritesheet("pipe", "../../assets/sprites/single-images/pipe.png", 160, 175);
}

function create() {
	toybox.create();	
	buildLevel1();

	function oopsFloor(floor, collidedSprite){
	      if( collidedSprite.y > floor.y - (floor.height / 2) ){
	          collidedSprite.y = floor.y - (floor.height / 2) - (collidedSprite.height / 2)
	      }
	  };

	floor.body.onCollide.add(oopsFloor);
}

function update() {
    toybox.update();
}

function buildLevel1(){
	backdrop = toybox.add.backdrop({ preset: "summer" });
	floor = toybox.add.platform({
		width: 320,
        height: 16,
        startingX: game.width / 2,
        startingY: game.height - 8,
        type: 4
    });
    leftLava = toybox.add.lava({
    	width: 160,
    	height: 16,
    	startingX: 80,
    	startingY: game.height - 8,
    	color: 'lightblue'
    });
    rightLava = toybox.add.lava({
    	width: 160,
    	height: 16,
    	startingX: 560,
    	startingY: game.height - 8,
    	color: 'lightblue'
    });
    globalBrickColor = "yellow";
    var topArray = ["normal","normal","normal","normal","coin","normal","mushroom","normal"];
    var bottomArray = ["normal","normal","normal","normal","normal","coin","normal","mushroom","normal"];
    var midArray = ["normal","normal","mushroom","normal","coin","normal","normal","normal","coin","normal","mushroom","normal"];
    brickPlatform(topArray,new Phaser.Point(12,140), 1.5, 1);
    brickPlatform(topArray,new Phaser.Point(game.width - 12,140), 1.5, -1);
    brickPlatform(["normal","normal","normal"], new Phaser.Point(320 - 24,140), 1.5, 1)
    brickPlatform(midArray,new Phaser.Point(190,250), 1.5, 1);
    brickPlatform(bottomArray,new Phaser.Point(12,370), 1.5, 1);
    brickPlatform(bottomArray,new Phaser.Point(game.width - 12,370), 1.5, -1);
    powBrick = toybox.add.multibrick({startingX: 320, startingY: 50, color: globalBrickColor, scale: 1.5, type: "pow", resetTimer: 45000})

    lever = toybox.add.lever({ 
        startingX: 320,
        startingY: 480 - 24,
        whileLeft: function(){
            if(toybox.oneOutOf(400)){ 
                generateEnemy(new Phaser.Point(100,100), "right");
            };
         
        },
        whileRight: function(){
        	if(toybox.oneOutOf(400)){ 
                generateEnemy(new Phaser.Point(540,100), "left");
            };
        }
    });
    

    var playerOptions = {
        startingX : 320,
        startingY: 454,
        color: "pink",
        jumpForce: 500,
        speed: 200,
        scale: 1
    }

    player1 = toybox.add.alien(playerOptions);
}

function brickPlatform (array, startingPoint, scale, direction){
	scale = scale || 1;
	direction = (direction == -1 || direction == 1) ? direction : 1;
	var blockSize = 16 * scale;
	for (var i = 0; i <= array.length - 1; i++) {
		toybox.add.multibrick({
			startingX: startingPoint.x + (blockSize * i * direction),
			startingY: startingPoint.y,
			type: array[i],
			scale: scale,
			color: globalBrickColor,
			resetTimer: 10000
		});
	}
}

function coinSplosion (){
	this.toybox.add.coin({startingX: this.x - 4, startingY: this.y, dX: -50, dY: -100});
    this.toybox.add.coin({startingX: this.x + 4, startingY: this.y, dX: 0, dY: -100});
    this.toybox.add.coin({startingX: this.x, startingY: this.y - 4, dX: 50, dY: -100});
}

function generateEnemy(point, enemyFacing){
	var enemies = ["slime","fly","jelly"];
	var thingToMake = randomizer(enemies);
	if (enemyFacing == "left"){
		var enemyDir = -1;
	} else {
		var enemyDir = 1
	}
    var newEnemy = toybox.add[thingToMake]({startingX: point.x, startingY: point.y, dX: (Phaser.Math.between(50,200)), dY: 200 * enemyDir, facing: enemyFacing});
    newEnemy.events.onKilled.add(coinSplosion, newEnemy);
}

var randomizer = function(array) {
    return array[Phaser.Math.between(0,(array.length - 1))];
}
