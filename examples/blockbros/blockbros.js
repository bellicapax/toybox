var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;
var settings = {
    gravity: 980,
    demoMode: true,
    plugins: ["crate","coin","mushroom","alien","backdrop","gem","slime","platform","spring","button","fly","badball","lever","fireball","jelly","lava","spikes","multibrick","fan","bubble"]
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

    gameIsBeingCleared = false;

    twoPlayerMode = false;

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
    globalplayer2ScorePosition = new Phaser.Point(538,5);
    globalGameLength = 105;
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

    highScores = {
        Level1: 0,
        Level2: 0,
        Level3: 0,
        Level4: 0
    }

    spacebarToReset = toybox.game.input.keyboard.addKey(32);

    isGameOver = false;

    switchLevel("MainMenu");
}

function update() {
    if (gameIsBeingCleared){
        return
    }

    toybox.update();

    if (currentLevel != "MainMenu"){
        gameTimerDisplay.setText(getTimerString(gameTimer));
    }

    if (gameTimer <= 0 && !isGameOver && currentLevel != "MainMenu"){
        endGame();
    }

    if (isGameOver && currentLevel != "MainMenu"){
        if (spacebarToReset.isDown){
            game.time.events.add(500, switchLevel, this, "MainMenu");
        }
    }
}

function beginGame(){
    gameIsBeingCleared = false;
    gameTimer = globalGameLength;
    if (currentLevel != "MainMenu"){
        toybox.sfx.gameWhistle.play();
    }

    game.time.events.loop(1000, function(){
        if (gameTimer <= 5 && gameTimer != 0 && currentLevel != "MainMenu"){
            toybox.sfx.gameWarning.play();
        }
        gameTimer = Phaser.Math.clampBottom(gameTimer - 1, 0);

        if( twoPlayerMode ){
            var winningPlayer = player1.score > player2.score ? player1 : player2;
            var losingPlayer = player1.score > player2.score ? player2 : player1;
            var scoreModifier = Math.floor( (winningPlayer.score - losingPlayer.score) / 100 ) * 2;

            if( !isGameOver ){
                winningPlayer.score -= scoreModifier;
            }
        }

    }, this);

    var timerStyles = Object.assign({},globalTextStyleObject);
    timerStyles.boundsAlignH = "center";

    if (currentLevel != "MainMenu"){
        gameTimerDisplay = toybox.add.text(0,0, getTimerString(gameTimer) ,timerStyles);
        boundText(gameTimerDisplay);
    }
}

function endGame(){
    isGameOver = true;
    toybox.sfx.gameWhistle.play();

    player1.attachedAlien.destroy();
    if (twoPlayerMode){
        player2.attachedAlien.destroy();
    }

    var winningPlayer = player1;

    if (twoPlayerMode) {
            if (player1.score != player2.score){
            var winningPlayer = (player1.score > player2.score) ? player1 : player2;
            var winMessage = winningPlayer.color + " WINS!"
        } else {
            var winMessage = "IT'S A DRAW!"
        }
    } else {
        var winMessage = "SCORE: " + player1.score;
    }

    var messageStyles = Object.assign({},globalTextStyleObject);
    messageStyles.boundsAlignH = "center";
    messageStyles.boundsAlignV = "middle";
    messageStyles.font = "bold 32pt Arial";
    messageObject = toybox.add.text(0,0, winMessage ,messageStyles);
    boundText(messageObject);

    messageStyles.font = "bold 12pt Arial";
    var tutorialHeadline = toybox.add.text(0,60, "HIT SPACEBAR TO RETURN TO MENU" ,messageStyles);
    boundText(tutorialHeadline);

    if (highScores[currentLevel] < winningPlayer.score){
        highScores[currentLevel] = winningPlayer.score;

        var newHighScoreHeadline = toybox.add.text(0,40, "NEW HIGH SCORE!" ,messageStyles);
        boundText(newHighScoreHeadline);
    }

    var oldHighScoreHeadline = toybox.add.text(0,-40, "HIGH SCORE: " + highScores[currentLevel] ,messageStyles);
    boundText(oldHighScoreHeadline);

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
    currentLevel = levelName
    gameIsBeingCleared = true;
    isGameOver = false;
    toybox.clear();
    window["build"+levelName]();
    beginGame();
}

function buildMainMenu(){
    globalBrickColor = "orange";
    backdrop = toybox.add.backdrop({ preset: "grey" });

    floor = toybox.add.platform({
        width: 480,
        height: 16,
        startingX: game.width / 2,
        startingY: game.height - 8,
        type: 0
    });

    floor.body.onCollide.add(oopsFloor);

    leftLava = toybox.add.lava({
        width: 80,
        height: 16,
        startingX: 40,
        startingY: game.height - 8,
        color: 'green'
    });
    rightLava = toybox.add.lava({
        width: 80,
        height: 16,
        startingX: 600,
        startingY: game.height - 8,
        color: 'green'
    });

    var testArray = ["normal","coin","normal","mushroom","normal","pow","normal","mushroom","normal","coin","normal"];
    var upperArray = ["striped","normal","striped","normal","striped","normal","striped","skip","skip","skip","striped","normal","striped","normal","striped","normal","striped"];

    brickPlatform(testArray,new Phaser.Point(200,375), 1.5, 1);
    brickPlatform(upperArray,new Phaser.Point(128,150), 1.5, 1);

    var messageStyles = Object.assign({},globalTextStyleObject);
    messageStyles.boundsAlignH = "center";
    messageStyles.boundsAlignV = "middle";
    messageStyles.font = "bold 32pt Arial";
    var messageObject = toybox.add.text(0,0, "SUPER BLOCK SIBLINGS" ,messageStyles);
    boundText(messageObject);
    messageStyles.font = "bold 9pt Arial";
    var tutorialHeadline = toybox.add.text(0,35, "CONTROLS: WASD / ARROWS" ,messageStyles);
    boundText(tutorialHeadline);
    var tutorialHeadline = toybox.add.text(0,55, "CLICK FOR FULLSCREEN" ,messageStyles);
    boundText(tutorialHeadline);
    var playerModeHeadline = toybox.add.text(0,160, "SWITCH FOR TWO PLAYER" ,messageStyles);
    boundText(playerModeHeadline);
    var levelHeadline = toybox.add.text(0,-160, "HIT BUTTON TO SELECT LEVEL" ,messageStyles);
    boundText(levelHeadline);


    spring = toybox.add.spring({ 
        startingX: 320,
        startingY: game.height - 125,
        immovable: true,
        allowGravity: false,
        springForce: 900
    });

    level1Button = toybox.add.button({ 
        startingX: 248,
        color: "yellow",
        onPress: function(){
            game.time.events.add(500, switchLevel, this, "Level1")
        }
    });

    level2Button = toybox.add.button({ 
        startingX: game.width - 248,
        color: "green",
        onPress: function(){
            game.time.events.add(500, switchLevel, this, "Level2")
        }
    });

    level3Button = toybox.add.button({ 
        startingX: game.width - 152,
        color: "blue",
        onPress: function(){
            game.time.events.add(500, switchLevel, this, "Level3")
        }
    });

    level3Button = toybox.add.button({ 
        startingX: 152,
        color: "red",
        onPress: function(){
            game.time.events.add(500, switchLevel, this, "Level4")
        }
    });

    lever = toybox.add.lever({ 
        startingX: 320,
        startingY: 480 - 24,
        facing: (twoPlayerMode) ? 'left' : 'right',
        whileRight: function(){
            if (twoPlayerMode){
                playerModeHeadline.setText("SWITCH FOR TWO PLAYER");
                twoPlayerMode = false;
                player2.attachedAlien.destroy();
                player2 = null;
            }
        },
        whileLeft: function(){
            if (!twoPlayerMode){
                playerModeHeadline.setText("SWITCH FOR ONE PLAYER");
                twoPlayerMode = true;
                var player2Options = Object.assign({startingX: 360, startingY: 450, color: "blue", facing: "right", controls: player2Controls}, globalAlienOptions);
                player2 = createBlockBrosPlayer(player2Options);
            }
        }
    });

    if (twoPlayerMode){
        lever.switch();
    }

    var player1Options = Object.assign({startingX: 280, startingY: 450, color: "pink", facing: "left"}, globalAlienOptions);
    player1 = createBlockBrosPlayer(player1Options);

    // if( twoPlayerMode ){
    //     var player2Options = Object.assign({startingX: 340, startingY: 450, color: "blue", facing: "right", controls: player2Controls}, globalAlienOptions);
    //     player2 = createBlockBrosPlayer(player2Options);
    // }

    var firstEnemy = generateEnemy(new Phaser.Point(260,240), "left");

    toybox.game.time.events.loop( 7000, function(){
        var enemyXPos = Math.random() > 0.5 ? 260 : game.width - 260;
        var enemyFacing = Math.random() > 0.5 ? "left" : "right";
        if(toybox.mobs.children.length < 4){
            newEnemy = generateEnemy(new Phaser.Point(enemyXPos,240), enemyFacing);
        }
    } , this );
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

    var topArray = ["normal","normal","normal","normal","normal","normal","mushroom","normal"];
    var bottomArray = ["normal","normal","normal","normal","normal","normal","normal","mushroom","normal"];
    var midArray = ["normal","mushroom","normal","coin","normal","normal","coin","normal","normal","coin","normal","mushroom","normal"];
    var smallArray = ["normal","coin","normal","normal","coin","normal"]
    brickPlatform(topArray,new Phaser.Point(12,140), 1.5, 1);
    brickPlatform(topArray,new Phaser.Point(game.width - 12,140), 1.5, -1);
    brickPlatform(["pow"], new Phaser.Point(320,60), 1.5, 1);
    brickPlatform(midArray,new Phaser.Point(178,225), 1.5, 1);
    brickPlatform(smallArray,new Phaser.Point(108,310), 1.5, 1);
    brickPlatform(["mushroom"], new Phaser.Point(320,310), 1.5, 1);
    brickPlatform(smallArray,new Phaser.Point(640 - 108,310), 1.5, -1);
    brickPlatform(bottomArray,new Phaser.Point(12,395), 1.5, 1);
    brickPlatform(bottomArray,new Phaser.Point(game.width - 12,395), 1.5, -1);

    leftPipe = toybox.add.decoration({spriteName: "pipe", startingX: 30, startingY: 70, scale: 0.45, sendTo: "top"});
    rightPipe = toybox.add.decoration({spriteName: "pipe", startingX: 610, startingY: 70, scale: 0.45, sendTo: "top"});
    rightPipe.scale.x = -.45;

    var startEnemy = generateEnemy(new Phaser.Point(40,70), "right");

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
    floor1 = toybox.add.platform({
        width: 128,
        height: 16,
        startingX: 64,
        startingY: game.height - 8,
        type: 1
    });
    floor1.body.onCollide.add(oopsFloor);
    floor2 = toybox.add.platform({
        width: 128,
        height: 16,
        startingX: game.width / 2,
        startingY: game.height - 8,
        type: 1
    });
    floor2.body.onCollide.add(oopsFloor);
    floor3 = toybox.add.platform({
        width: 128,
        height: 16,
        startingX: game.width - 64,
        startingY: game.height - 8,
        type: 1
    });
    floor3.body.onCollide.add(oopsFloor);

    leftLava = toybox.add.lava({
        width: 128,
        height: 16,
        startingX: 192,
        startingY: game.height - 8,
        color: 'red'
    });
    rightLava = toybox.add.lava({
        width: 128,
        height: 16,
        startingX: game.width - 192,
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

    var smallArray = ["coin","striped","coin"];
    var largeArray = ["striped","coin","normal","mushroom","normal","coin","striped"];

    brickPlatform(largeArray,new Phaser.Point(84,322), 1.5, 1);
    brickPlatform(largeArray,new Phaser.Point(game.width - 84,322), 1.5, -1);
    brickPlatform(largeArray,new Phaser.Point(125,140), 1.5, 1);
    brickPlatform(largeArray,new Phaser.Point(game.width - 125,140), 1.5, -1);
    brickPlatform(smallArray,new Phaser.Point(12,240), 1.5, 1);
    brickPlatform(smallArray,new Phaser.Point(game.width - 12,240), 1.5, -1);
    brickPlatform(smallArray,new Phaser.Point(225,240), 1.5, 1);
    brickPlatform(smallArray,new Phaser.Point(game.width - 225,240), 1.5, -1);
    brickPlatform(smallArray,new Phaser.Point(200,405), 1.5, 1);
    brickPlatform(smallArray,new Phaser.Point(game.width - 200,405), 1.5, -1);
    brickPlatform(smallArray,new Phaser.Point(12,405), 1.5, 1);
    brickPlatform(smallArray,new Phaser.Point(game.width - 12,405), 1.5, -1);

    leftPowBrick = toybox.add.multibrick({startingX: 85, startingY: 50, color: globalBrickColor, scale: 1.5, type: "pow", resetTimer: 45000});
    rightPowBrick = toybox.add.multibrick({startingX: game.width - 85, startingY: 50, color: globalBrickColor, scale: 1.5, type: "pow", resetTimer: 45000});

    leftPipe = toybox.add.decoration({spriteName: "pipe", startingX: 200, startingY: 30, scale: 0.45, sendTo: "top"});
    leftPipe.rotation = Math.PI/2;
    rightPipe = toybox.add.decoration({spriteName: "pipe", startingX: game.width - 200, startingY: 30, scale: 0.45, sendTo: "top"});
    rightPipe.rotation = Math.PI/2;

    var player1Options = Object.assign({startingX: 224, startingY: 380, color: "pink", facing: "left"}, globalAlienOptions);
    player1 = createBlockBrosPlayer(player1Options, globalplayer1ScorePosition);

    if( twoPlayerMode ){
        var player2Options = Object.assign({startingX: game.width - 224, startingY: 380, color: "blue", facing: "right", controls: player2Controls}, globalAlienOptions);
        player2 = createBlockBrosPlayer(player2Options, globalplayer2ScorePosition);
    }

    toybox.game.time.events.loop( 2500, function(){
        var enemyXPos = Math.random() > 0.5 ? 200 : game.width - 200;
        var enemyFacing = Math.random() > 0.5 ? "left" : "right";
        generateEnemy(new Phaser.Point(enemyXPos,70), enemyFacing);
    } , this );
}

function buildLevel3(){
    globalBrickColor = "blue";

    backdrop = toybox.add.backdrop({ preset: "spring" });
    floor = toybox.add.platform({
        width: 480,
        height: 16,
        startingX: game.width / 2,
        startingY: game.height - 8,
        type: 7
    });

    floor.body.onCollide.add(oopsFloor);

    leftLava = toybox.add.lava({
        width: 80,
        height: 16,
        startingX: 40,
        startingY: game.height - 8,
        color: 'black'
    });
    rightLava = toybox.add.lava({
        width: 80,
        height: 16,
        startingX: 600,
        startingY: game.height - 8,
        color: 'black'
    });

    var largeArray = ["normal","normal","normal","mushroom","normal","striped"];
    var smallArray = ["coin","normal","coin"];
    var powArray = ["striped","pow","striped"];
    var bottomArray = ["striped","coin","normal","mushroom","normal","coin","striped"];

    brickPlatform(largeArray,new Phaser.Point(12,140), 1.5, 1);
    brickPlatform(largeArray,new Phaser.Point(game.width - 12,140), 1.5, -1);
    brickPlatform(smallArray,new Phaser.Point(320 - 20,140), 1.5, 1);
    brickPlatform(smallArray, new Phaser.Point(108,255), 1.5, 1);
    brickPlatform(smallArray, new Phaser.Point(game.width - 108,255), 1.5, -1);
    brickPlatform(smallArray, new Phaser.Point(320 - 20,255), 1.5, 1);
    brickPlatform(powArray, new Phaser.Point(320 - 20,45), 1.5, 1)
    //brickPlatform(midArray,new Phaser.Point(190,250), 1.5, 1);
    brickPlatform(largeArray,new Phaser.Point(12,370), 1.5, 1);
    brickPlatform(largeArray,new Phaser.Point(game.width - 12,370), 1.5, -1);
    brickPlatform(smallArray,new Phaser.Point(320 - 20,370), 1.5, 1);

    leftPipe1 = toybox.add.decoration({spriteName: "pipe", startingX: 109, startingY: 30, scale: 0.45, sendTo: "top"});
    leftPipe1.rotation = Math.PI/2;
    rightPipe1 = toybox.add.decoration({spriteName: "pipe", startingX: game.width - 109, startingY: 30, scale: 0.45, sendTo: "top"});
    rightPipe1.rotation = Math.PI/2;
    leftPipe2 = toybox.add.decoration({spriteName: "pipe", startingX: 10, startingY: 255, scale: 0.45, sendTo: "top"});
    rightPipe2 = toybox.add.decoration({spriteName: "pipe", startingX: 630, startingY: 255, scale: 0.45, sendTo: "top"});
    rightPipe2.scale.x = -.45;


    var player1Options = Object.assign({startingX: 133, startingY: 230, color: "pink", facing: "right"}, globalAlienOptions);
    player1 = createBlockBrosPlayer(player1Options, globalplayer1ScorePosition);

    if (twoPlayerMode){
        var player2Options = Object.assign({startingX: game.width - 133, startingY: 230, color: "blue", facing: "left", controls: player2Controls}, globalAlienOptions);
        player2 = createBlockBrosPlayer(player2Options, globalplayer2ScorePosition);
    }

    toybox.game.time.events.loop( 2000, function(){
        if (toybox.oneOutOf(2)){
            var enemyXPos = Math.random() > 0.5 ? 108 : game.width - 108;
            var enemyFacing = Math.random() > 0.5 ? "left" : "right";
           generateEnemy(new Phaser.Point(enemyXPos,70), enemyFacing); 
        }
    } , this );

    toybox.game.time.events.loop( 2000, function(){
        if (toybox.oneOutOf(2)){
            var enemyXPos = Math.random() > 0.5 ? 20 : game.width - 20;
            var enemyFacing = enemyXPos == 20 ? "right" : "left";
           generateEnemy(new Phaser.Point(enemyXPos,255), enemyFacing); 
        }
    } , this );

    toybox.game.time.events.loop( 1000, function(){
        if (toybox.oneOutOf(2)){
            var bubbleXPos = Math.random() > 0.5 ? 224 : 425;
            bubbleXPos += Phaser.Math.between(-4,4);
            var bubbleSize = Math.round( (Math.random() * 1.25 + 1) * 100 ) / 100
            toybox.add.bubble({
                growRate: 0.1,
                maxScale: bubbleSize,
                startingX: bubbleXPos,
                startingY: game.height - 30,
                killTimer: 5800,
                dY: -75})
        }
    } , this );
}

function buildLevel4(){
    globalBrickColor = "random";

    backdrop = toybox.add.backdrop({ preset: "blue" });

    leftLava = toybox.add.lava({
        width: game.width,
        height: 16,
        startingX: game.width / 2,
        startingY: game.height - 8,
        color: 'orange'
    });

    brickGrid(new Phaser.Point(68,96),new Phaser.Point(22,15),1.5,3);

    leftPipe = toybox.add.decoration({spriteName: "pipe", startingX: 250, startingY: 10, scale: 0.45, sendTo: "top"});
    leftPipe.rotation = Math.PI/2;
    rightPipe = toybox.add.decoration({spriteName: "pipe", startingX: game.width - 250, startingY: 10, scale: 0.45, sendTo: "top"});
    rightPipe.rotation = Math.PI/2;

    var player1Options = Object.assign({startingX: 90, startingY: 54, color: "pink", facing: "right"}, globalAlienOptions);
    player1 = createBlockBrosPlayer(player1Options, globalplayer1ScorePosition);

    if (twoPlayerMode){
        var player2Options = Object.assign({startingX: game.width - 90, startingY: 54, color: "blue", facing: "left", controls: player2Controls}, globalAlienOptions);
        player2 = createBlockBrosPlayer(player2Options, globalplayer2ScorePosition);
    } 

    toybox.game.time.events.loop( 2500, function(){
        var enemyXPos = Math.random() > 0.5 ? 250 : game.width - 250;
        var enemyFacing = Math.random() > 0.5 ? "left" : "right";
        generateEnemy(new Phaser.Point(enemyXPos,20), enemyFacing);
    } , this );
}

function brickGrid(startingPoint,gridDimensions,scale,frequency){
    gridArray = [];

    for (var i = gridDimensions.y - 1; i >= 0; i--) {
        var currentRow = [];
        gridArray.push(currentRow);
        for (var j = gridDimensions.x - 1; j >= 0; j--) {
            currentRow.push(0);
        }
    };

    makeBlockInGrid(0,0,3);
    makeBlockInGrid(gridArray[0].length - 3,0,3);

    for (var fillerY = 0; fillerY <= (gridDimensions.y / 2) - 1; fillerY++) {
        for (var fillerX = (gridDimensions.x / 2) - 2; fillerX <= (gridDimensions.x / 2); fillerX++) {
           gridArray[fillerY][fillerX] = 1;
        }
    };

    for (var iy = gridDimensions.y; iy >= 0; iy--) {
        for (var ix = gridDimensions.x; ix >= 0; ix--) {
            var shouldBuildBrick = Phaser.Math.between(0,frequency - 1) == 0;
            if (shouldBuildBrick){
                var scaleMultiplier = Phaser.Math.between(1,3);
                tryMakeBLock(ix,iy,scaleMultiplier);
            }
        }
    };

    function checkForSpace(xPos,yPos,size){
        var spaceBlockWouldOccupy = [];
        for (var tempy = yPos + scaleMultiplier - 1; tempy >= yPos; tempy--) {
            for (var tempx = xPos + scaleMultiplier - 1; tempx >= xPos; tempx--) {
                if( typeof(gridArray[tempy]) == "undefined" || typeof(gridArray[tempy][tempx]) == "undefined" ){
                    spaceBlockWouldOccupy.push(1);
                } else {
                    spaceBlockWouldOccupy.push(gridArray[tempy][tempx]);
                }
            }
        }
        var isThereSpace = ( spaceBlockWouldOccupy.reduce((a, b) => a + b, 0) == 0 );
        return isThereSpace;
    }

    function randomizeBlockType(){
        var blockArray = ["normal","normal","normal","normal","coin","coin","coin","coin","mushroom","mushroom","mushroom","pow"];
        return blockArray[Phaser.Math.between(0,blockArray.length - 1)]
    }

    function makeBlockInGrid(xPos,yPos,size){
        var blockScale = size * scale;
        var basePixelsize = scale * 16

        for (var iy = yPos; iy <= yPos + size - 1; iy++) {
            for (var ix = xPos; ix <= xPos + size - 1; ix++) {
                gridArray[iy][ix] = 1;
            }
        }

        var blockType = randomizeBlockType()

        toybox.add.multibrick({
            startingX: startingPoint.x + (xPos * basePixelsize) + ((size - 1) * basePixelsize / 2),
            startingY: startingPoint.y + (yPos * basePixelsize) + ((size - 1) * basePixelsize / 2),
            type: blockType,
            scale: blockScale,
            color: globalBrickColor,
            resetTimer: 10000
        });
    }

    function tryMakeBLock(xPos,yPos,size){
        if (size == 3){
            if (checkForSpace(xPos,yPos,size)){
                makeBlockInGrid(xPos,yPos,size)
            } else {
                size = 2;
            }
        }
        if (size == 2){
            if (checkForSpace(xPos,yPos,size)){
                makeBlockInGrid(xPos,yPos,size)
            } else {
                size = 1;
            }
        }
        if (size == 1){
            if (checkForSpace(xPos,yPos,size)){
                makeBlockInGrid(xPos,yPos,size)
            }
        }
    }

}

function brickPlatform (array, startingPoint, scale, direction){
	scale = scale || 1;
	direction = (direction == -1 || direction == 1) ? direction : 1;
	var blockSize = 16 * scale;
	for (var i = 0; i <= array.length - 1; i++) {
        if (array[i] != "skip"){
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
        if( typeof(this.attachedAlien) != "undefined" ){
            this.attachedAlien.destroy();
            var thisIsTheirFirstAlien = false;
        } else {
            var thisIsTheirFirstAlien = true;
        }
        this.attachedAlien = toybox.add.alien(this.playerOptions);
        this.attachedAlien.controllingPlayer = this;
        this.attachedAlien.color = this.playerOptions.color.toUpperCase();
        if ( !thisIsTheirFirstAlien ){
            this.attachedAlien.invulnerability = 400;
        }
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

function generateEnemy(point, enemyFacing, thingToMake, optionalColor){
	var enemies = ["slime","fly","jelly","badball"];
    if (typeof(thingToMake) == "undefined"){
        var thingToMake = randomizer(enemies);
    }
	if (enemyFacing == "left"){
		var enemyDir = -1;
	} else {
		var enemyDir = 1
	}
    var newEnemy = toybox.add[thingToMake]({startingX: point.x, startingY: point.y, dX: (Phaser.Math.between(50,200)), dY: 200 * enemyDir, facing: enemyFacing, color: optionalColor});
    if (thingToMake == "badball"){
        newEnemy.speed = 50;
        newEnemy.events.onUpdate.add(function(){
            this.speed += 1;
            Phaser.Math.clamp(this.speed,300);
        }, newEnemy);
    }
    if (thingToMake == "jelly"){
        newEnemy.health = 2;
        newEnemy.events.onKilled.removeAll();
        newEnemy.events.onOutOfBounds.add(newEnemy.destroy, newEnemy);
        newEnemy.events.onKilled.add(function(jelly){
            newEnemy.toybox.game.time.events.add(2000, function(){
                this.destroy();
                var cGO = this.toybox.currentGameObjects;
                var index = cGO.indexOf(this);
                cGO.splice(index,1);
            }, newEnemy);
            var slime1 = generateEnemy( new Phaser.Point(jelly.x - 8, jelly.y), "left", 'slime', jelly.color);
            slime1.body.velocity = new Phaser.Point(-100,100);
            var slime2 = generateEnemy( new Phaser.Point(jelly.x + 8, jelly.y), "right", 'slime', jelly.color);
            slime2.body.velocity = new Phaser.Point(100,100);
            var slime3 = slime3 = generateEnemy( new Phaser.Point(jelly.x, jelly.y - 8), "left", 'slime', jelly.color);
            slime3.body.velocity = new Phaser.Point(0,100);
        }, newEnemy);
    } else {
        newEnemy.events.onKilled.add(coinSplosion, newEnemy);
    }
    return newEnemy;
}

var randomizer = function(array) {
    return array[Phaser.Math.between(0,(array.length - 1))];
}
