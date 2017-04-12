var game = new Phaser.Game(1024, 576, Phaser.AUTO, '', {
	preload: preload,
	create: create,
	update: update
});
var toybox;
var settings = {
	gravity: 980,
	plugins: ["alien", "alienAstronaut", "crate"]
};
var crate;
var triangle = {
	a: new Phaser.Point(),
	b: new Phaser.Point(),
	c: new Phaser.Point()
};
var blowStrength = 5;
var blowables = [];
var players = [];
var containers = [];
var containerGraphics;
var playersGraphics = [];

var levelSettings = {
	numPlayers : 1,
	numContainers: 2,
	containerSize: 200,
	nextblowableDelay: 3000,
	blowableSpeedMin: 10,
	blowableSpeedMax: 50,
	goalsToPop : 2
};


function preload() {
	toybox = new Toybox(game, settings);
	toybox.preload();
	game.input.gamepad.start();

}

function create() {
	toybox.create();
	containerGraphics = game.add.graphics(0, 0);
	for (var i = 0; i < 4; i++) {
		playersGraphics.push(game.add.graphics(0, 0));
	}
	createLevel();
}

function createLevel() {
	createContainers();
	drawContainers(containerGraphics);
	createAstronauts();
	createBlowable();
}

function createAstronauts() {
	for (var i = 0; i < levelSettings.numPlayers; i++) {
		createAstronaut(i);
	}
}

function createAstronaut(playerNo) {
	var alienAstronautOptions = {
		startingX: containers[playerNo].x,
		startingY: containers[playerNo].y,
		flyForce: 2.25,
		speed: 250,
		collideWorld : false,
		pad : game.input.gamepad["pad" + (playerNo + 1).toString()]
	};
	var player = toybox.add.alienAstronaut(alienAstronautOptions);
	player.graphics = playersGraphics[playerNo];
	players.push(player);
}

function createContainers() {
	createContainer(0);
	createContainer(1);
}

function createContainer(playerNumber) {
	var point = getContainerPositionForPlayer(playerNumber);
	var container = new Phaser.Circle(point.x, point.y, levelSettings.containerSize);
	container.type = "";
	containers.push(container);
}

function getContainerPositionForPlayer(player) {
	var point = new Phaser.Point();
	point.x = player == 0 ? levelSettings.containerSize * 0.5 : game.world.width - levelSettings.containerSize;
	point.y = game.world.centerY;
	return point;
}

function createBlowable() {
	var speed = Phaser.Math.between(levelSettings.blowableSpeedMin, levelSettings.blowableSpeedMax);
	var xIsZero = toybox.diceRoll(2) == 1;
	var crateOptions = {
		scale: 1,
		startingX: game.world.centerX,
		startingY: game.world.centerY,
		allowGravity: false
	};
	crate = toybox.add.crate(crateOptions);
	crate.events.onKilled.addOnce(createBlowable);
	crate.update = function () {};
	crate.body.collideWorldBounds = false;
	crate.body.drag = new Phaser.Point(0);
	blowables.push(crate);
}

function drawContainers(graphics) {
	graphics.clear();
	graphics.lineStyle(5, 0xffffff, 1);
	for (var i = 0; i < containers.length; i++) {
		graphics.drawCircle(containers[i].x, containers[i].y, containers[i].diameter);
	}
}

function update() {
	toybox.update();
	updateContainers();
	wrapStuff();
}

function updateContainers() {
	for (var i = 0; i < blowables.length; i++) {
		for (var j = 0; j < containers.length; j++) {
			if (containers[j].contains(blowables[i].x, blowables[i].y)) {
				var dist = Phaser.Math.distance(containers[j].x, containers[j].y, blowables[i].x, blowables[i].y);
				if (dist < containers[j].diameter / 3) {
					scorePoint(blowables[i], containers[j]);
				} else {
					var normalizedDir = new Phaser.Point(blowables[i].x - containers[j].x, blowables[i].y - containers[j].y).normalize();
					var distanceModifier = Phaser.Math.linear(1, 0.1, dist / containers[j].diameter);
					blowables[i].body.velocity.x -= normalizedDir.x * blowStrength * distanceModifier;
					blowables[i].body.velocity.y -= normalizedDir.y * blowStrength * distanceModifier;
				}
			}
		}
	}
}

function wrapStuff() {
	for (var i = 0; i < players.length; i++) {
		game.world.wrap(players[i], 0, true);
	}
	for (var i = 0; i < blowables.length; i++) {
		game.world.wrap(blowables[i], 0, true);
	}
}

function scorePoint(blowable, container) {
	var index = blowables.indexOf(blowable);
	if (index > -1) {
		blowables.splice(index, 1);
	}
	blowable.kill();
	updateContainerSize(container);
}

function updateContainerSize(container) {
	var toSubtract = levelSettings.containerSize / levelSettings.goalsToPop;
	if(container.diameter - toSubtract > 0){
		container.diameter -= toSubtract;
		drawContainers(containerGraphics);
	}
	else {
		console.log("You won!");
		clearLevel();
		createLevel();
	}
}

function clearLevel() {
	players = [];
	containers = [];
	blowables = [];
	toybox.clear();
}
