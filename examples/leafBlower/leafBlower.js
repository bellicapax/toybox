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
var triangle = {
    a: new Phaser.Point(),
    b: new Phaser.Point(),
    c: new Phaser.Point()
};
var floaties = [];
var blowStrength = 5;
var blowerReach = 120;
var hypotenuse;
const halfAngle = Phaser.Math.degToRad(15);
var containerGraphics;
var containers = [];
var levelSettings = {
    numContainers: 2,
    containerSize: 100,
    nextFloatieDelay: 1000,
    floatieSpeedMin : 10,
    floatieSpeedMax : 50
};

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
        }
    }else if(this.controls.down.isDown){
      var angularspeed = new Phaser.Point();
      this.toybox.game.physics.arcade.velocityFromAngle(this.angle + 90, this.jumpForce, angularspeed);
      this.body.velocity.x += angularspeed.x;
      this.body.velocity.y += angularspeed.y;
      if (this.animations.name !== "jump") {
          this.animations.play("jump");
      }
    }

    var pointer = this.toybox.game.input.activePointer;
    calculateTriangle(this, pointer);
    drawTriangle(this.graphics, pointer.isDown);
    if (pointer.isDown) {
        var floatiesToBlow = getFloatiesToBlow(this);
        blowFloaties(floatiesToBlow, this, pointer);
    }
}

function calculateTriangle(sprite, pointer) {
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

function getFloatiesToBlow() {
    var floatiesToBlow = [];
    for (var i = 0; i < floaties.length; i++) {
        if (pointIsInTriangle(floaties[i].x, floaties[i].y, triangle)) {
            floatiesToBlow.push(floaties[i]);
        }
    }
    return floatiesToBlow;
}

function blowFloaties(floatiesToBlow, sprite, pointer) {
    var normalizedDir = new Phaser.Point(pointer.x - sprite.x, pointer.y - sprite.y).normalize();
    for (var i = 0; i < floatiesToBlow.length; i++) {
        var dist = Phaser.Math.distance(sprite.x, sprite.y, floatiesToBlow[i].x, floatiesToBlow[i].y);
        var distanceModifier = Phaser.Math.linear(1, 0.1, dist / hypotenuse);
        floatiesToBlow[i].body.velocity.x += normalizedDir.x * blowStrength * distanceModifier;
        floatiesToBlow[i].body.velocity.y += normalizedDir.y * blowStrength * distanceModifier;
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
    var hypOverAdj = (1 / Math.cos(halfAngle));
    var adjacent = blowerReach;
    hypotenuse = hypOverAdj * adjacent;
}

function create() {
    toybox.create();
    createContainers();
    containerGraphics = game.add.graphics(0, 0);
    drawContainers(containerGraphics);
    createAstronaut();
    createFloatie();
}

function createFloatie() {
    var speed = Phaser.Math.between(levelSettings.floatieSpeedMin, levelSettings.floatieSpeedMax);
    var xIsZero = toybox.diceRoll(2) == 1;
    var crateOptions = {
        scale: 1,
        startingX: (xIsZero ? 0 : Phaser.Math.between(0, game.world.width)),
        startingY: (!xIsZero ? 0 : Phaser.Math.between(0, game.world.height)),
        allowGravity: false,
        dX: xIsZero ? speed : 0,
        dY: !xIsZero ? speed : 0,
        update: destroyOutsideBounds
    };
    crate = toybox.add.crate(crateOptions);
    crate.body.collideWorldBounds = false;
    floaties.push(crate);
    game.time.events.add(levelSettings.nextFloatieDelay, createFloatie);
}

function destroyOutsideBounds() {
    if (this.x < 0 || this.x > this.toybox.game.world.width || this.y < 0 || this.y > this.toybox.game.world.height) {
        var index = floaties.indexOf(this);
        if (index > -1) {
            floaties.splice(index, 1);
        }
        this.kill();
    }
}

function createAstronaut() {
    var alienAstronautOptions = {
        allowGravity: false,
        update: alienAstronautUpdate,
        startingX: game.world.centerX,
        startingY: game.world.centerY,
        jumpForce: 1,
        speed: 250,
        controls: {
            left: 65,
            right: 68,
            up: 87,
            down: 83
        }
    };
    var player = toybox.add.alien(alienAstronautOptions);
    player.body.allowGravity = false;
    player.graphics = game.add.graphics(0, 0);
}

function createContainers() {
    var point = getRandomContainerPosition();
    var container = new Phaser.Circle(point.x, point.y, levelSettings.containerSize);
    container.type = "";
    containers.push(container);
}

function getRandomContainerPosition() {
    var point = new Phaser.Point();
    point.x = Phaser.Math.between(levelSettings.containerSize, game.world.width - levelSettings.containerSize);
    point.y = Phaser.Math.between(levelSettings.containerSize, game.world.height - levelSettings.containerSize);
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
}

function updateContainers() {
    for (var i = 0; i < floaties.length; i++) {
        for (var j = 0; j < containers.length; j++) {
            if (containers[j].contains(floaties[i].x, floaties[i].y)) {
                var dist = Phaser.Math.distance(containers[j].x, containers[j].y, floaties[i].x, floaties[i].y);
                if (dist < containers[j].diameter / 3) {
                    scorePoint(floaties[i]);
                } else {
                    var normalizedDir = new Phaser.Point(floaties[i].x - containers[j].x, floaties[i].y - containers[j].y).normalize();
                    var distanceModifier = Phaser.Math.linear(1, 0.1, dist / containers[j].diameter);
                    floaties[i].body.velocity.x -= normalizedDir.x * blowStrength * distanceModifier;
                    floaties[i].body.velocity.y -= normalizedDir.y * blowStrength * distanceModifier;
                }
            }
        }
    }
}

function scorePoint(floatie) {
    var index = floaties.indexOf(floatie);
    if (index > -1) {
        floaties.splice(index, 1);
    }
    floatie.kill();
}
