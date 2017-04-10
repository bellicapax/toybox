// Below mapping applies to XBOX 360 Wired and Wireless controller on Google Chrome (tested on Windows 7).
// - Firefox uses different map! Separate amount of buttons and axes. DPAD = axis and not a button.
// In other words - discrepancies when using gamepads.
// Phaser.Gamepad.XBOX360_A = 0;
// Phaser.Gamepad.XBOX360_B = 1;
// Phaser.Gamepad.XBOX360_X = 2;
// Phaser.Gamepad.XBOX360_Y = 3;
// Phaser.Gamepad.XBOX360_LEFT_BUMPER = 4;
// Phaser.Gamepad.XBOX360_RIGHT_BUMPER = 5;
// Phaser.Gamepad.XBOX360_LEFT_TRIGGER = 6;
// Phaser.Gamepad.XBOX360_RIGHT_TRIGGER = 7;
// Phaser.Gamepad.XBOX360_BACK = 8;
// Phaser.Gamepad.XBOX360_START = 9;
// Phaser.Gamepad.XBOX360_STICK_LEFT_BUTTON = 10;
// Phaser.Gamepad.XBOX360_STICK_RIGHT_BUTTON = 11;
//
// Phaser.Gamepad.XBOX360_DPAD_LEFT = 14;
// Phaser.Gamepad.XBOX360_DPAD_RIGHT = 15;
// Phaser.Gamepad.XBOX360_DPAD_UP = 12;
// Phaser.Gamepad.XBOX360_DPAD_DOWN = 13;
//
// //  On FF 0 = Y, 1 = X, 2 = Y, 3 = X, 4 = left bumper, 5 = dpad left, 6 = dpad right
// Phaser.Gamepad.XBOX360_STICK_LEFT_X = 0;
// Phaser.Gamepad.XBOX360_STICK_LEFT_Y = 1;
// Phaser.Gamepad.XBOX360_STICK_RIGHT_X = 2;
// Phaser.Gamepad.XBOX360_STICK_RIGHT_Y = 3;

const halfAngle = Phaser.Math.degToRad(15);
const JOYSTICK_THRESHOLD = 0.15;
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
var blowables = [];
var blowStrength = 5;
var players = [];

var containerGraphics;
var containers = [];
var levelSettings = {
	numContainers: 2,
	containerSize: 200,
	nextblowableDelay: 3000,
	blowableSpeedMin: 10,
	blowableSpeedMax: 50,
	goalsToPop : 4
};
var pad1;
var pad2;
var leftStickX = Phaser.Gamepad.XBOX360_STICK_LEFT_X;
var leftStickY = Phaser.Gamepad.XBOX360_STICK_LEFT_Y;
var rightStickX = Phaser.Gamepad.XBOX360_STICK_RIGHT_X;
var rightStickY = Phaser.Gamepad.XBOX360_STICK_RIGHT_Y;
var accelAxis = Phaser.Gamepad.XBOX360_RIGHT_TRIGGER;
var decelAxis = Phaser.Gamepad.XBOX360_LEFT_TRIGGER;
var blowButton = Phaser.Gamepad.XBOX360_RIGHT_BUMPER;
var midAngle = 0;

function alienAstronautUpdate() {
	if (this.isHit) {
		return;
	}

	if (this.health <= 0) {
		this.kill();
		return;
	}

	var usingGamepad = this.toybox.game.input.gamepad.padsConnected > 0;
	var padInput = getPadInput(this.controls.pad);
	this.body.angularVelocity = 0;
	if (this.controls.right.isDown || padInput.leftX > JOYSTICK_THRESHOLD) {
		var modifier = this.controls.right.isDown ? 1 : padInput.leftX;
		this.body.angularVelocity = this.speed * modifier;
		if (this.animations.name !== "run") {
			this.animations.play("run");
		}
	} else if (this.controls.left.isDown || padInput.leftX < -JOYSTICK_THRESHOLD) {
		var modifier = this.controls.left.isDown ? 1 : Math.abs(padInput.leftX);
		this.body.angularVelocity = -this.speed * modifier;
		if (this.animations.name !== "run") {
			this.animations.play("run");
		}
	}

	// checkForBoost
	var angularspeed = new Phaser.Point();
	if (this.controls.up.isDown || padInput.accel > JOYSTICK_THRESHOLD) {
		this.toybox.game.physics.arcade.velocityFromAngle(this.angle + 90, this.jumpForce, angularspeed);
		var modifier = this.controls.up.isDown ? 1 : padInput.accel;
		this.body.velocity.x -= angularspeed.x * modifier;
		this.body.velocity.y -= angularspeed.y * modifier;
		if (this.animations.name !== "jump") {
			this.animations.play("jump");
		}
	} else if (this.controls.down.isDown || padInput.decel > JOYSTICK_THRESHOLD) {
		this.toybox.game.physics.arcade.velocityFromAngle(this.angle + 90, this.jumpForce, angularspeed);
		var modifier = this.controls.down.isDown ? 1 : padInput.decel;
		this.body.velocity.x += angularspeed.x * modifier;
		this.body.velocity.y += angularspeed.y * modifier;
		if (this.animations.name !== "jump") {
			this.animations.play("jump");
		}
	}

	var pointer = this.toybox.game.input.activePointer;
	setMidAngle(this, pointer);
	calculateTriangle(this);
	var shouldBlow = pointer.isDown || padInput.blow;

	drawTriangle(this.graphics, shouldBlow);
	if (shouldBlow) {
		var blowablesToBlow = getblowablesToBlow(this);
		if (usingGamepad) {
			if (Math.abs(padInput.rightX) > JOYSTICK_THRESHOLD || Math.abs(padInput.rightY)) {
				this.normalizedDir = new Phaser.Point(padInput.rightX, padInput.rightY).normalize()
			}
		} else {
			this.normalizedDir = new Phaser.Point(pointer.x - this.x, pointer.y - this.y).normalize();
		}
		blowblowables(blowablesToBlow, this, this.normalizedDir);
	}
}

function getPadInput(pad) {
	return {
		leftX: pad.axis(leftStickX),
		leftY: pad.axis(leftStickY),
		rightX: pad.axis(rightStickX),
		rightY: pad.axis(rightStickY),
		accel: pad.buttonValue(accelAxis),
		decel: pad.buttonValue(decelAxis),
		blow: pad.isDown(blowButton)
	};
}

function setMidAngle(sprite, pointer) {
	if (sprite.toybox.game.input.gamepad.padsConnected > 0) {
		var xAxis = sprite.controls.pad.axis(rightStickX);
		var yAxis = sprite.controls.pad.axis(rightStickY);
		if (Math.abs(xAxis) > JOYSTICK_THRESHOLD || Math.abs(yAxis) > JOYSTICK_THRESHOLD) {
			midAngle = Math.atan2(yAxis, xAxis);
		}
	} else {
		midAngle = Phaser.Math.angleBetween(sprite.x, sprite.y, pointer.x, pointer.y);
	}
}

function calculateTriangle(sprite) {
	var angleToLeft = midAngle + halfAngle;
	var angleToRight = midAngle - halfAngle;
	var leftDirection = new Phaser.Point(Math.cos(angleToLeft), Math.sin(angleToLeft));
	var rightDirection = new Phaser.Point(Math.cos(angleToRight), Math.sin(angleToRight));
	var leftPoint = new Phaser.Point(sprite.x + leftDirection.x * hypotenuse, sprite.y + leftDirection.y * hypotenuse);
	var rightPoint = new Phaser.Point(sprite.x + rightDirection.x * hypotenuse, sprite.y + rightDirection.y * hypotenuse);
	triangle.a = new Phaser.Point(sprite.x, sprite.y);
	triangle.b = leftPoint;
	triangle.c = rightPoint;
}

function drawTriangle(graphics, shouldFill) {
	graphics.clear();
	graphics.lineStyle(1, 0xffffff, 1);
	if (shouldFill) {
		graphics.fillAlpha = 0.5;
		graphics.beginFill(0xffffff);
	}
	graphics.moveTo(triangle.a.x, triangle.a.y);
	graphics.lineTo(triangle.b.x, triangle.b.y);
	graphics.lineTo(triangle.c.x, triangle.c.y);
	graphics.lineTo(triangle.a.x, triangle.a.y);
}

function getblowablesToBlow() {
	var blowablesToBlow = [];
	for (var i = 0; i < blowables.length; i++) {
		if (pointIsInTriangle(blowables[i].x, blowables[i].y, triangle)) {
			blowablesToBlow.push(blowables[i]);
		}
	}
	return blowablesToBlow;
}

function blowblowables(blowablesToBlow, sprite, normalizedDir) {
	for (var i = 0; i < blowablesToBlow.length; i++) {
		var dist = Phaser.Math.distance(sprite.x, sprite.y, blowablesToBlow[i].x, blowablesToBlow[i].y);
		var distanceModifier = Phaser.Math.linear(1, 0.1, dist / hypotenuse);
		blowablesToBlow[i].body.velocity.x += normalizedDir.x * blowStrength * distanceModifier;
		blowablesToBlow[i].body.velocity.y += normalizedDir.y * blowStrength * distanceModifier;
	}
}

function pointIsInTriangle(px, py, triangle) {
	//credit: http://www.blackpawn.com/texts/pointinpoly/default.html
	var ax = triangle.a.x;
	var ay = triangle.a.y;
	var bx = triangle.b.x;
	var by = triangle.b.y;
	var cx = triangle.c.x;
	var cy = triangle.c.y;
	var v0 = [cx - ax, cy - ay];
	var v1 = [bx - ax, by - ay];
	var v2 = [px - ax, py - ay];

	var dot00 = (v0[0] * v0[0]) + (v0[1] * v0[1]);
	var dot01 = (v0[0] * v1[0]) + (v0[1] * v1[1]);
	var dot02 = (v0[0] * v2[0]) + (v0[1] * v2[1]);
	var dot11 = (v1[0] * v1[0]) + (v1[1] * v1[1]);
	var dot12 = (v1[0] * v2[0]) + (v1[1] * v2[1]);

	var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);

	var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
	var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

	return ((u >= 0) && (v >= 0) && (u + v < 1));
}

function preload() {
	toybox = new Toybox(game, settings);
	toybox.preload();
	game.input.gamepad.start();

}

function create() {
	toybox.create();
	createContainers();
	containerGraphics = game.add.graphics(0, 0);
	drawContainers(containerGraphics);
	createAstronaut(0);
	// createAstronaut(1);
	createBlowable();
}

function createBlowable() {
	var speed = Phaser.Math.between(levelSettings.blowableSpeedMin, levelSettings.blowableSpeedMax);
	var xIsZero = toybox.diceRoll(2) == 1;
	var crateOptions = {
		scale: 1,
		startingX: game.world.centerX,
		startingY: game.world.centerY,
		allowGravity: false
		// dX: xIsZero ? speed : 0,
		// dY: !xIsZero ? speed : 0,
		// update: destroyOutsideBounds
	};
	crate = toybox.add.crate(crateOptions);
	crate.events.onKilled.addOnce(createBlowable);
	crate.update = function () {};
	crate.body.collideWorldBounds = false;
	crate.body.drag = new Phaser.Point(0);
	blowables.push(crate);
	// game.time.events.add(levelSettings.nextblowableDelay, createBlowable);
}

// function destroyOutsideBounds() {
// 	if (this.x < 0 || this.x > this.toybox.game.world.width || this.y < 0 || this.y > this.toybox.game.world.height) {
// 		var index = blowables.indexOf(this);
// 		if (index > -1) {
// 			blowables.splice(index, 1);
// 		}
// 		this.kill();
// 	}
// }

function createAstronaut(playerNo) {
	var alienAstronautOptions = {
		// allowGravity: false,
		// update: alienAstronautUpdate,
		startingX: containers[playerNo].x,
		startingY: containers[playerNo].y,
		flyForce: 2.25,
		speed: 250,
		collideWorld : false,
		pad : game.input.gamepad["pad" + (playerNo + 1).toString()]
	};
	var player = toybox.add.alienAstronaut(alienAstronautOptions);
	player.controls.pad = game.input.gamepad.pad1;
	player.body.allowGravity = false;
	player.graphics = game.add.graphics(0, 0);
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
	}
}
