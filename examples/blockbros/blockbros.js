var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;
var settings = {
    gravity: 980,
    demoMode: false,
    plugins: ["crate","coin","mushroom","alien","backdrop","gem","slime","platform","spring","button","fly","lever","fireball","jelly","lava","spikes","multibrick"]
};

function preload() {
    toybox = new Toybox(game, settings);
    toybox.preload();
    toybox._game.load.spritesheet("pipe", "../../assets/sprites/single-images/pipe.png", 160, 175);
    toybox._game.load.audio("gameWarning", "../../assets/sfx/chirp-2.wav");
    toybox._game.load.audio("gameWhistle", "../../assets/sfx/chirp-1.wav");
}

function create() {
	toybox.create();
    toybox.sfx["gameWarning"] = game.sound.add("gameWarning");
    toybox.sfx["gameWhistle"] = game.sound.add("gameWhistle");

    playersArray = [];
    levelsArray = [];

    globalAlienOptions = {
        jumpForce: 500,
        speed: 200,
        scale: 1,
        health: 1
    }
    player2Controls = {
        left: 65,
        right: 68,
        jump: 87
    }
    globalplayer1ScorePosition = new Phaser.Point(5,5);
    globalplayer2ScorePosition = new Phaser.Point(550,5);
    globalGameLength = 120;
    globalDeathPenalty = 0;
    globalTextStyleObject = {
        fill: "#fff",
        font: "bold 12pt Arial",
        boundsAlignH: "left",
        boundsAlignV: "top",
        stroke: "#000",
        strokeThickness: 5
    }
    globalBrickColor = "yellow";

    isGameOver = false;

    levelNames = ["Level1","Level2"];

    currentLevel = levelNames[Phaser.Math.between(0,levelNames.length - 1)];

    switchLevel("MainMenu");
}

function update() {
    toybox.update();

    gameTimerDisplay.setText(getTimerString(gameTimer));

    if (gameTimer <= 0 && !isGameOver){
        endGame();
    }
}

function beginGame(){
    gameTimer = globalGameLength;
    toybox.sfx.gameWhistle.play();

    game.time.events.loop(1000, function(){
        if (gameTimer <= 5 && gameTimer != 0){
            toybox.sfx.gameWarning.play();
        }
        gameTimer = Phaser.Math.clampBottom(gameTimer - 1, 0);
    }, this);

    var timerStyles = Object.assign({},globalTextStyleObject);
    timerStyles.boundsAlignH = "center";
    gameTimerDisplay = toybox.add.text(0,0, getTimerString(gameTimer) ,timerStyles);
    boundText(gameTimerDisplay);
}

function endGame(){
    isGameOver = true;
    toybox.sfx.gameWhistle.play();

    player1.attachedAlien.destroy();
    player2.attachedAlien.destroy();

    if (player1.score != player2.score){
        var winnerName = (player1.score > player2.score) ? player1.color : player2.color;
        var winMessage = winnerName + " WINS!"
    } else {
        var winMessage = "IT'S A DRAW!"
    }

    var messageStyles = Object.assign({},globalTextStyleObject);
    messageStyles.boundsAlignH = "center";
    messageStyles.boundsAlignV = "middle";
    messageStyles.font = "bold 32pt Arial";
    messageObject = toybox.add.text(0,0, winMessage ,messageStyles);
    boundText(messageObject);

}

function boundText(textObject){
    textObject.setTextBounds(5, 5, game.width - 5, game.height - 5);
}

function oopsFloor(floor, collidedSprite){
    if( collidedSprite.y > floor.y - (floor.height / 2) ){
        collidedSprite.y = floor.y - (floor.height / 2) - (collidedSprite.height / 2)
    }
};

function getTimerString(totalSeconds){
    var minutes = Math.floor( totalSeconds / 60 );
    var seconds = totalSeconds % 60;
    return FormatNumberLength(minutes, 2) + ":" + FormatNumberLength(seconds, 2);
}

function FormatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}

function switchLevel(levelName){
    toybox.clear();
    window["build"+levelName]();
    beginGame();
}

function buildMainMenu(){

    floor = toybox.add.platform({
        width: game.width,
        height: 16,
        startingX: game.width / 2,
        startingY: game.height - 8,
        type: 0
    });

    floor.body.onCollide.add(oopsFloor);

    var messageStyles = Object.assign({},globalTextStyleObject);
    messageStyles.boundsAlignH = "center";
    messageStyles.boundsAlignV = "middle";
    messageStyles.font = "bold 32pt Arial";
    messageObject = toybox.add.text(0,0, "SUPER BLOCK SIBLINGS" ,messageStyles);
    boundText(messageObject);

    level1Button = toybox.add.button({ 
       startingX: 200,
       color: "yellow",
       onPress: function(){
           switchLevel("Level1")
       }
    });

    var player1Options = Object.assign({startingX: 300, startingY: 450, color: "pink", facing: "left"}, globalAlienOptions);
    player1 = createBlockBrosPlayer(player1Options, globalplayer1ScorePosition);

    var player2Options = Object.assign({startingX: 340, startingY: 450, color: "blue", facing: "right", controls: player2Controls}, globalAlienOptions);
    player2 = createBlockBrosPlayer(player2Options, globalplayer2ScorePosition);
}

function buildLevel1(){
    globalBrickColor = "yellow";

	backdrop = toybox.add.backdrop({ preset: "summer" });
	floor = toybox.add.platform({
		width: 320,
        height: 16,
        startingX: game.width / 2,
        startingY: game.height - 8,
        type: 4
    });

    floor.body.onCollide.add(oopsFloor);

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

    var topArray = ["normal","normal","normal","normal","coin","normal","mushroom","normal"];
    var bottomArray = ["normal","normal","normal","normal","normal","coin","normal","mushroom","normal"];
    var midArray = ["normal","normal","mushroom","normal","coin","normal","normal","normal","coin","normal","mushroom","normal"];
    brickPlatform(topArray,new Phaser.Point(12,140), 1.5, 1);
    brickPlatform(topArray,new Phaser.Point(game.width - 12,140), 1.5, -1);
    brickPlatform(["normal","pow","normal"], new Phaser.Point(320 - 24,140), 1.5, 1)
    brickPlatform(midArray,new Phaser.Point(190,250), 1.5, 1);
    brickPlatform(bottomArray,new Phaser.Point(12,370), 1.5, 1);
    brickPlatform(bottomArray,new Phaser.Point(game.width - 12,370), 1.5, -1);

    leftPipe = toybox.add.decoration({spriteName: "pipe", startingX: 30, startingY: 70, scale: 0.45, sendTo: "top"});
    rightPipe = toybox.add.decoration({spriteName: "pipe", startingX: 610, startingY: 70, scale: 0.45, sendTo: "top"});
    rightPipe.scale.x = -.45;

    lever = toybox.add.lever({ 
        startingX: 320,
        startingY: 480 - 24,
        whileLeft: function(){
            if(toybox.oneOutOf(200)){ 
                generateEnemy(new Phaser.Point(40,70), "right");
            };
         
        },
        whileRight: function(){
        	if(toybox.oneOutOf(200)){ 
                generateEnemy(new Phaser.Point(620,70), "left");
            };
        }
    });

    var player1Options = Object.assign({startingX: 300, startingY: 450, color: "pink", facing: "left"}, globalAlienOptions);
    player1 = createBlockBrosPlayer(player1Options, globalplayer1ScorePosition);

    var player2Options = Object.assign({startingX: 340, startingY: 450, color: "blue", facing: "right", controls: player2Controls}, globalAlienOptions);
    player2 = createBlockBrosPlayer(player2Options, globalplayer2ScorePosition);
}

function buildLevel2(){
    globalBrickColor = "gray";

    backdrop = toybox.add.backdrop({ preset: "green" });
    floor = toybox.add.platform({
        width: 320,
        height: 16,
        startingX: game.width / 2,
        startingY: game.height - 8,
        type: 1
    });

    floor.body.onCollide.add(oopsFloor);

    leftLava = toybox.add.lava({
        width: 160,
        height: 16,
        startingX: 80,
        startingY: game.height - 8,
        color: 'red'
    });
    rightLava = toybox.add.lava({
        width: 160,
        height: 16,
        startingX: 560,
        startingY: game.height - 8,
        color: 'red'
    });

    spring = toybox.add.spring({ 
        startingX: 320,
        startingY: game.height - 24,
        immovable: true,
        allowGravity: false,
        springForce: 900
    });

    var topArray = ["normal","mushroom","normal","coin","normal","coin","normal"];
    var smallArray = ["coin","striped","coin"];
    var bottomArray = ["normal","striped","normal","striped","normal","striped","mushroom","striped","coin","striped"];

    brickPlatform(bottomArray,new Phaser.Point(12,340), 1.5, 1);
    brickPlatform(bottomArray,new Phaser.Point(game.width - 12,340), 1.5, -1);
    brickPlatform(topArray,new Phaser.Point(125,140), 1.5, 1);
    brickPlatform(topArray,new Phaser.Point(game.width - 125,140), 1.5, -1);
    brickPlatform(smallArray,new Phaser.Point(12,240), 1.5, 1);
    brickPlatform(smallArray,new Phaser.Point(game.width - 12,240), 1.5, -1);
    brickPlatform(smallArray,new Phaser.Point(150,240), 1.5, 1);
    brickPlatform(smallArray,new Phaser.Point(game.width - 150,240), 1.5, -1);
    brickPlatform(smallArray,new Phaser.Point(208,405), 1.5, 1);
    brickPlatform(smallArray,new Phaser.Point(game.width - 208,405), 1.5, -1);

    leftPowBrick = toybox.add.multibrick({startingX: 85, startingY: 50, color: globalBrickColor, scale: 1.5, type: "pow", resetTimer: 45000});
    rightPowBrick = toybox.add.multibrick({startingX: game.width - 85, startingY: 50, color: globalBrickColor, scale: 1.5, type: "pow", resetTimer: 45000});

    leftPipe = toybox.add.decoration({spriteName: "pipe", startingX: 200, startingY: 30, scale: 0.45, sendTo: "top"});
    leftPipe.rotation = Math.PI/2;
    rightPipe = toybox.add.decoration({spriteName: "pipe", startingX: game.width - 200, startingY: 30, scale: 0.45, sendTo: "top"});
    rightPipe.rotation = Math.PI/2;

    var player1Options = Object.assign({startingX: 220, startingY: 450, color: "pink", facing: "left"}, globalAlienOptions);
    player1 = createBlockBrosPlayer(player1Options, globalplayer1ScorePosition);

    var player2Options = Object.assign({startingX: 420, startingY: 450, color: "blue", facing: "right", controls: player2Controls}, globalAlienOptions);
    player2 = createBlockBrosPlayer(player2Options, globalplayer2ScorePosition);

    toybox.game.time.events.loop( 3000, function(){
        var enemyXPos = Math.random() > 0.5 ? 200 : game.width - 200;
        var enemyFacing = Math.random() > 0.5 ? "left" : "right";
        generateEnemy(new Phaser.Point(enemyXPos,70), enemyFacing);
    } , this );
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

function createBlockBrosPlayer( playerOptions, scorePositionPoint){
    var newPlayer = {};
    newPlayer.score = 0;
    if (typeof(scorePositionPoint) != "undefined"){
        newPlayer.scoreBoard = toybox.add.text(scorePositionPoint.x,scorePositionPoint.y,newPlayer.score,globalTextStyleObject);
    }
    newPlayer.playerOptions = playerOptions;
    newPlayer.color = playerOptions.color.toUpperCase();
    newPlayer.spawnNewAlien = function(){
        if( isGameOver ){
            return;
        }
        this.attachedAlien = toybox.add.alien(this.playerOptions);
        this.attachedAlien.controllingPlayer = this;
        this.attachedAlien.color = this.playerOptions.color.toUpperCase();
        this.attachedAlien.events.onUpdate.add(function(){
            this.controllingPlayer.score += this.score;
            var scoreText = this.color.toUpperCase() + ": " + this.controllingPlayer.score;
            if (typeof(newPlayer.scoreBoard) != "undefined"){
                this.controllingPlayer.scoreBoard.setText(scoreText);
            }
            this.score = 0;
        }, this.attachedAlien);
        this.attachedAlien.events.onKilled.addOnce(function(){
            this.controllingPlayer.score -= globalDeathPenalty;
            this.controllingPlayer.score = Phaser.Math.clampBottom(this.controllingPlayer.score, 0);
            game.time.events.add(3000, this.controllingPlayer.spawnNewAlien, this.controllingPlayer);
        }, this.attachedAlien);
    };
    newPlayer.spawnNewAlien();
    return newPlayer;
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
