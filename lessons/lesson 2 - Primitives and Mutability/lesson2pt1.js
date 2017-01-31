var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;
var cursors;
var playerXSize;

function preload() {
    toybox = new Toybox(game);
    toybox.preload();
}

function create() {
    createBananaText();
    createSmartCarText();
    // toybox.add.player("greenAlien", 100, 100);
    // toybox.add.collectible("purpleMushroom", 200, 0);
    // toybox.add.coin(0, 200, 200);
}

function createBananaText() {
    var bananaText = game.add.text(-50, game.world.height * 0.5, "banana", {
        fill: "#ffffff",
        align: "right"
    });
    bananaText.anchor.setTo(1, 0.5);
    var bananaTween = game.tweens.create(bananaText);
    bananaTween.to({
        x: game.world.centerX - 25
    }, 1000, Phaser.Easing.Bounce.Out, true);
}

function createSmartCarText() {
    var smartCarText = game.add.text(game.world.width + 50, game.world.height * 0.5, "smartCar", {
        fill: "#ffffff",
        align: "left"
    });
    smartCarText.anchor.setTo(0, 0.5);
    var smartCarTween = game.tweens.create(smartCarText);
    smartCarTween.to({
        x: game.world.centerX + 25
    }, 1000, Phaser.Easing.Bounce.Out, true);
}

function update() {
    toybox.update();
    // var diceRoll = Math.random() * 64
    // trySpawnMushrooms(diceRoll);
    // trySpawnBlocks(diceRoll);
    // trySpawnCoin();
}

function trySpawnMushrooms(diceRoll) {
    if (diceRoll >= 63) {
        toybox.add.collectible("purpleMushroom", Math.random() * game.world.width, 0);
    }
}

function trySpawnBlocks(diceRoll) {
    if (diceRoll <= 2) {
        toybox.add.block("crate1", Math.random() * game.world.width, 0);
    }
}

function trySpawnCoin() {
    if (Math.random() * 100 < 1) {
        toybox.add.coin(Math.floor(Math.random() * 3), Math.random() * game.world.width, 0);
    }
}
