var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;
var settings = {
    gravity: 980,
    plugins: ["alien","button"]
};
var plugins = ["alien","astronaut","bird","bullet","button","chest","coin","crate","fan","fireball","fly","gem","jelly","key","lava","mushroom","pet","slime","spikes","spring"];
var actions = ["attack","follow","activate","fly","duplicate","be invisible to other players","shoot","jump","run","teleport","change clothes","kill","collide","move","feed","feed","enlarge","fall","spin","eat","multiply","level up"];
var adjectives = ["quickly","awkwardly","with friends","inside out","with a cat","quickly","with pomegranate","with a stick","with a meow","spastically","while jumping","with some wings","with my siblings","characteristically","hesitantly","slowly","backwards","perfectly","sideways","randomly","with fire","with constantly changing colors","right side up","sneakily","with your voice", "with a poof", "awkwardly"];
var pluginText;
var actionText;
var adjectiveText;


function preload() {
    toybox = new Toybox(game, settings);
    toybox.preload();
}

function create() {
  toybox.create();
  toybox.add.alien();
  toybox.add.button({startingX: game.world.centerX, startingY : game.world.height - 10, onPress : displayThreeThings});
  pluginText = game.add.text(game.world.centerX, game.world.centerY - 50, "", {fill: "#ffffff", align: "center"});
  actionText = game.add.text(game.world.centerX, game.world.centerY, "", {fill: "#ffffff", align : "center"});
  adjectiveText = game.add.text(game.world.centerX, game.world.centerY + 50, "", {fill: "#ffffff", align : "center"});
}

function displayThreeThings() {
  pluginText.text = plugins[Math.floor(Math.random() * plugins.length)];
  actionText.text = actions[Math.floor(Math.random() * actions.length)];
  adjectiveText.text = adjectives[Math.floor(Math.random() * adjectives.length)];
}

function update() {
    toybox.update();
}
