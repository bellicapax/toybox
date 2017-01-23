"use strict"

class Toybox{
  constructor(game){
    this.game = game;
  }

  // let suzy = 5;

  logSuzy(){
    console.log("suzy is " + 5);
  }

  preload(){

  }

  create(){

  }

  update(){

  }

  function createPlayer(spritesheetName, startingX, startingY)
  {
  	var player = game.add.sprite(startingX, startingY, spritesheetName, 1);
  	player.anchor.setTo(0.5, 0.5);
  	addAnimationsToPlayer(player);
  	addInputToPlayer(player);
  	return player;
  }

  function addAnimationsToPlayer(player) {
  	player.animations.add("walk", [9, 10], 8, true);
  	player.animations.play("walk");
  }

  function addInputToPlayer(player) {
  	ensureCursorsAreCreated();
  	game.input.keyboard.addCallbacks(game, tryMovePlayer);
  }

  function ensureCursorsAreCreated(){
  	if(cursors === null || cursors === undefined)
  	{
  		cursors = game.input.keyboard.createCursorKeys();
  	}
  }

  function tryMovePlayer(args) {
    console.log(args[0]);
    console.log(args[1]);
  }
}
