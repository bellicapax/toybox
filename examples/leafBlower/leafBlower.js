var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
	preload: preload,
	create: create,
	update: update
});
var toybox;
var settings = {
	gravity: 980,
	plugins: ["alien", "crate"]
};
var crate;
var triangle = { a: new Phaser.Point(), b: new Phaser.Point(), c: new Phaser.Point()};
var leaves = [];
var blowStrength = 25;

function alienAstronautUpdate() {
	if (this.isHit) {
		return;
	}

	if (this.health <= 0) {
		this.kill();
		return;
	}

	this.body.angularVelocity = 0;
	if (this.controls.right.isDown) {
		this.body.angularVelocity = this.speed;
		if (this.animations.name !== "run") {
			this.animations.play("run");
		}
	} else if (this.controls.left.isDown) {
		this.body.angularVelocity = -this.speed;
		if (this.animations.name !== "run") {
			this.animations.play("run");
		}
	}

	// checkForJump
	if (this.controls.up.isDown) {
		var angularspeed = new Phaser.Point();
		this.toybox.game.physics.arcade.velocityFromAngle(this.angle + 90, this.jumpForce, angularspeed);
		this.body.velocity.x -= angularspeed.x;
		this.body.velocity.y -= angularspeed.y;
		if (this.animations.name !== "jump") {
			this.animations.play("jump");
			this.toybox.sfx.alienJump.play();
		}
	}

	var pointer = this.toybox.game.input.activePointer;
	calculateTriangle(this, pointer);
  drawTriangle(this.graphics);
  var leavesToBlow = getLeavesToBlow(this);
  blowLeaves(leavesToBlow, this, pointer);
}

function calculateTriangle(sprite, pointer) {
  var halfAngle = Phaser.Math.degToRad(15);
  var hypOverAdj = (1 / Math.cos(halfAngle));
  var adjacent = Phaser.Math.distance(sprite.x, sprite.y, pointer.x, pointer.y);
  var hypotenuse = hypOverAdj * adjacent;
  var angleBetweenPlayerAndPointer = Phaser.Math.angleBetween(sprite.x, sprite.y, pointer.x, pointer.y);
  var angleToLeft = angleBetweenPlayerAndPointer + halfAngle;
  var angleToRight = angleBetweenPlayerAndPointer - halfAngle;
  var leftDirection = new Phaser.Point(Math.cos(angleToLeft), Math.sin(angleToLeft));
  var rightDirection = new Phaser.Point(Math.cos(angleToRight), Math.sin(angleToRight));
  var leftPoint = new Phaser.Point(sprite.x + leftDirection.x * hypotenuse, sprite.y + leftDirection.y * hypotenuse);
  var rightPoint = new Phaser.Point(sprite.x + rightDirection.x * hypotenuse, sprite.y + rightDirection.y * hypotenuse);
  triangle.a = new Phaser.Point(sprite.x, sprite.y);
  triangle.b = leftPoint;
  triangle.c = rightPoint;
}

function drawTriangle(graphics) {
	graphics.clear();
	graphics.lineStyle(1, 0xffffff, 1);
	graphics.moveTo(triangle.a.x, triangle.a.y);
	graphics.lineTo(triangle.b.x, triangle.b.y);
	graphics.lineTo(triangle.c.x, triangle.c.y);
	graphics.lineTo(triangle.a.x, triangle.a.y);
}

function getLeavesToBlow(){
  var leavesToBlow = [];
  for (var i = 0; i < leaves.length; i++) {
    if(pointIsInTriangle(leaves[i].x, leaves[i].y, triangle))    {
      leavesToBlow.push(leaves[i]);
    }
  }
  return leavesToBlow;
}

function blowLeaves(leavesToBlow, sprite, pointer) {
  var normalizedDir = new Phaser.Point(pointer.x - sprite.x, pointer.y - sprite.y).normalize();
  for (var i = 0; i < leavesToBlow.length; i++) {
    leavesToBlow[i].body.velocity.x += normalizedDir.x * blowStrength;
    leavesToBlow[i].body.velocity.y += normalizedDir.y * blowStrength;
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
}

function create() {
	toybox.create();
	game.time.events.loop(1500, createCrate);
	createAstronaut();
	createCrate();
}

function createCrate() {
	var speed = Phaser.Math.between(25, 100);
	var xIsZero = toybox.diceRoll(2) == 1;
	var crateOptions = {
		scale: 1,
		startingX: (xIsZero ? 0 : Phaser.Math.between(0, game.world.width)),
		startingY: (!xIsZero ? 0 : Phaser.Math.between(0, game.world.height)),
		allowGravity: false,
		dX: xIsZero ? speed : 0,
		dY: !xIsZero ? speed : 0,
    update : destroyOutsideBounds
	};
	crate = toybox.add.crate(crateOptions);
	crate.body.collideWorldBounds = false;
  leaves.push(crate);
}

function destroyOutsideBounds() {
  if(this.x < 0 || this.x > this.toybox.game.world.width || this.y < 0 || this.y > this.toybox.game.world.height)
  {
    var index = leaves.indexOf(this);
    if (index > -1) {
      leaves.splice(index, 1);
    }
    this.kill();
  }
}

function createAstronaut() {
	var alienAstronautOptions = {
		allowGravity: false,
		update: alienAstronautUpdate,
		startingY: game.world.height,
		jumpForce: 1,
		controls: {
			left: 37,
			right: 39,
			up: 38,
			down: 40
		}
	};
	console.log(typeof (alienAstronautOptions.update) == "undefined");
	var player = toybox.add.alien(alienAstronautOptions);
	player.body.allowGravity = false;
	player.graphics = game.add.graphics(0, 0);
}

function update() {

	toybox.update();
}
