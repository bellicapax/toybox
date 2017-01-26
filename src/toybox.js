var  player;
var currentGameObjects = [];
var speed = 1;

class Toybox{
  constructor(game){
    console.log("Toybox constructed");
    this.game = game;
    this.cursors = this.game.input.keyboard.createCursorKeys();
  }


  preload(){
    this.game.load.spritesheet("greenAlien", "assets/sprites/greenAlienSheet.png", 16, 20);
    this.game.load.spritesheet("blueAlien", "assets/sprites/blueAlienSheet.png", 16, 20);
    this.game.load.spritesheet("pinkAlien", "assets/sprites/pinkAlienSheet.png", 16, 20);

    this.preloadMobs();
  }

  preloadMobs(){
    this.game.load.spritesheet("blackFly", "assets/sprites/blackFlySheet.png", 16, 16);
    this.game.load.spritesheet("blueFly", "assets/sprites/blueFlySheet.png", 16, 16);
    this.game.load.spritesheet("blackSlime", "assets/sprites/blackSlimeSheet.png", 16, 16);
    this.game.load.spritesheet("blueSlime", "assets/sprites/blueSlimeSheet.png", 16, 16);
    this.game.load.spritesheet("blueSnail", "assets/sprites/blueSnailSheet.png", 16, 16);
    this.game.load.spritesheet("greenFish", "assets/sprites/greenFishSheet.png", 16, 16);
    this.game.load.spritesheet("greenSlime", "assets/sprites/greenSlimeSheet.png", 16, 16);
    this.game.load.spritesheet("purpleSlime", "assets/sprites/purpleSlimeSheet.png", 16, 16);
    this.game.load.spritesheet("redFly", "assets/sprites/redFlySheet.png", 16, 16);
    this.game.load.spritesheet("redSlime", "assets/sprites/redSlimeSheet.png", 16, 16);
    this.game.load.spritesheet("silverFish", "assets/sprites/silverFishSheet.png", 16, 16);
    this.game.load.spritesheet("yellowFly", "assets/sprites/yellowFlySheet.png", 16, 16);
    this.game.load.spritesheet("yellowSlime", "assets/sprites/yellowSlimeSheet.png", 16, 16);
    this.game.load.spritesheet("yellowSnail", "assets/sprites/yellowSnailSheet.png", 16, 16);

  }

  create(){

  }

  update(){
    var myToybox = this;
    currentGameObjects.forEach(function(gameObject){
      gameObject.update();
    });

  }

  addAnimationsToPlayer(player) {
    // player.animations.add("walk", [9, 10], 8, true);
    // player.animations.play("walk");
  }

  createPlayer(spritesheetName, startingX, startingY){
    if(player != null){
      player.destroy();
    }
  	player = this.game.add.sprite(startingX, startingY, spritesheetName, 1);
  	player.anchor.setTo(0.5, 0.5);
  	this.addAnimationsToPlayer(player);
    player.toybox = this;
    player.update = function(){
      if(this.toybox.cursors.up.isDown){
        this.y -= speed;
      }
      else if(this.toybox.cursors.down.isDown){
        this.y += speed;
      }
      if(this.toybox.cursors.right.isDown){
        this.x += speed;
      }
      else if(this.toybox.cursors.left.isDown){
        this.x -= speed;
      }

      if(this.x > this.toybox.game.world.width)
      {
        this.x = 0;
      }
    };
    currentGameObjects.push(player);
  	return player;
  }

}
