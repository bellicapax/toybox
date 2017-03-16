var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;
var settings = {
    gravity: 980,
    plugins: ["alien"]
};

function alienAstronautUpdate(){
    if (this.isHit){
        return;
    }

    if (this.health <= 0){
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

  // Draw line to pointer
  this.graphics.clear();
  this.graphics.lineStyle(1, 0xffffff, 1);

  this.graphics.moveTo(this.x, this.y);
  var pointer = this.toybox.game.input.activePointer;
  this.graphics.lineTo(pointer.x, pointer.y);

};

function preload() {
    toybox = new Toybox(game, settings);
    toybox.preload();
}

function create() {
  toybox.create();
  var alienAstronautOptions = {
    allowGravity : false,
    update : alienAstronautUpdate,
    startingY : game.world.height,
    jumpForce : 1,
    controls : {
        left: 37,
        right: 39,
        up: 38,
        down: 40
    }
  };
  console.log(typeof(alienAstronautOptions.update) == "undefined");
  var player = toybox.add.alien(alienAstronautOptions);
  player.body.allowGravity = false;
  player.graphics = game.add.graphics(0,0);
  // player.body.drag = new Phaser.Point(200,200);
}

function update() {

    toybox.update();
}
