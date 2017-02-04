// Now we are going to go a little deeper into the types that Javascript variables can hold
// Javascript has 5 basic primitive types: Boolean, Number, String, Null, and Undefined

// Say hello to our two variables for this lesson - banana and smartCar
var banana;
var smartCar;









// ---- END OF LESSON MATERIAL ---

var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;
var cursors;
var playerXSize;
var tweenSpeedInMs = 100;

function preload() {
    toybox = new Toybox(game);
    toybox.preload();
}

function create() {
    createTextAnimation();
}

function createTextAnimation() {
    var bananaText = createBananaText();
    var bananaTween = createBananaTween(bananaText);
    var plusText = createPlusText();
    var plusTween = createPlusTween(plusText);
    var smartCarText = createSmartCarText();
    var smartCarTween = createSmartCarTween(smartCarText);
    var equalsText = createEqualsText();
    var equalsTween = createEqualsTween(equalsText);
    var concatenationText = createConcatenationText();
    var concatenationTween = createConcatenationTween(concatenationText);
    bananaTween.chain(plusTween, smartCarTween, equalsTween, concatenationTween);
    bananaTween.start();
}


function createBananaText() {
    var bananaText = game.add.text(-50, game.world.height * 0.5, String(banana), {
        fill: "#ffffff",
        align: "right"
    });
    bananaText.anchor.setTo(1, 0.5);
    return bananaText;
}

function createBananaTween(bananaText) {
    var bananaTween = game.tweens.create(bananaText);
    bananaTween.to({
        x: game.world.centerX - 25
    }, tweenSpeedInMs, Phaser.Easing.Bounce.Out);
    return bananaTween;
}

function createSmartCarText() {
    var smartCarText = game.add.text(game.world.width + 50, game.world.height * 0.5, String(smartCar), {
        fill: "#ffffff",
        align: "left"
    });
    smartCarText.anchor.setTo(0, 0.5);
    return smartCarText;
}

function createSmartCarTween(smartCarText) {
    var smartCarTween = game.tweens.create(smartCarText);
    smartCarTween.to({
        x: game.world.centerX + 25
    }, tweenSpeedInMs, Phaser.Easing.Bounce.Out);
    return smartCarTween;
}

function createPlusText() {
    var plusText = game.add.text(game.world.centerX, -50, "+", {
        fill: "#ffffff",
        align: "center"
    });
    plusText.anchor.setTo(0.5);
    return plusText;
}

function createPlusTween(plusText) {
    var plusTween = game.tweens.create(plusText);
    plusTween.to({
        y: game.world.centerY
    }, tweenSpeedInMs, Phaser.Easing.Bounce.Out);
    return plusTween;
}

function createEqualsText() {
    var equalsText = game.add.text(game.world.centerX, game.world.centerY + 50, "=", {
        fill: "#ffffff",
        align: "center"
    });
    equalsText.anchor.setTo(0.5);
    equalsText.scale = new Phaser.Point(0, 0);
    return equalsText;
}

function createEqualsTween(equalsText) {
    var equalsTween = game.tweens.create(equalsText.scale);
    equalsTween.to({
        x: 1,
        y: 1
    }, tweenSpeedInMs, Phaser.Easing.Bounce.Out);
    return equalsTween;
}

function createConcatenationText() {
    var concatenation = String(banana + smartCar);
    var concatenationText = game.add.text(game.world.centerX, game.world.height + 50, concatenation, {
        fill: "#ffffff",
        align: "center"
    });
    concatenationText.anchor.setTo(0.5);
    return concatenationText;
}

function createConcatenationTween(concatenationText) {
    var concatenationTween = game.tweens.create(concatenationText);
    concatenationTween.to({
        y: game.world.centerY + 100
    }, tweenSpeedInMs, Phaser.Easing.Bounce.Out);
    return concatenationTween;
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
