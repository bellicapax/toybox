// Now we are going to go a little deeper into the types that Javascript variables can hold
// Javascript has 5 basic primitive types: Boolean, Number, String, Null, and Undefined

// Say hello to our two variables for this lesson - banana and smartCar
// They are named this way to help you remember that you can name variables however you like
// Also, they will be used for many purposes in this lesson, so I picked fun names instead of practical
var banana;
var smartCar;

// -------ONE-------
// Here now we are assigning these variables to strings
// All through this lesson, we'll be exploring what happens
// when we use the + operator to "add" two variables together.
// This will teach us some of the ways that Javascript works with primitive types
// Can you guess what the result of "banana" and "smartCar" is?
// Go ahead and open lesson2part1.html to see the result!
banana = "banana";
smartCar = "smartCar";

// -------TWO-------
// We are going to be commenting and uncommenting code in this exercise
// All these sentences you are reading are comments
// Comments are defined by the two forward slashes "//" to the left of the comment
// Go ahead and comment either the line assigning banana or the line assigning smartCar and see what happens
// Just put two forward slashes in front of one of those two lines and refresh the page

// -------THREE-------
// You found a new type without even assigning the variable to something different!
// undefined means that the variable has been declared, but nothing has been assigned to it
// Because the browser knows that the other variable is a string, it made undefined a string and smushed them together
// Now try commenting out both of the lines that assign banana and smartCar to strings
// Refresh the page and see what happens

// -------FOUR-------
// You should have gotten a new result - NaN!
// NaN stands for "Not a Number" - the browser tried to add two undefined types as numbers
// But undefined is not something that can be added to itself
// The browser told us it tried, but didn't get a number it understood
// Let's give the browser a break and do some normal addition
// Uncomment the next two lines and refresh the page
// banana = 10;
// smartCar = 5;

// -------FIVE-------
// Now we're going to peek at a new concept: dynamic typing!
// Dynamic typing in Javascript means:
// 1) We don't have to tell the computer what KIND of variable we want before we assign it
// 2) The same variable can hold different types at different times
// We are going to assign to banana AGAIN
// What do you think the value of banana will be? Will it be what is on line 41 or what's below?
// Try to guess what will happen when you refresh the page
// Uncomment the line below and refresh the page!
// banana = false;

// -------SIX-------
// Did it do what you expected?
// 1)Why it printed false instead of 10:
// -Javascript reads your file from top to bottom
// -When it calls for a value from a variable, the most recent value above the line calling for it will be used.
// 2)Why the answer was 5:
// -Javascript will try to add everything as a number until it encounters a string
// -true and false in Javascript (and many languages) can be represented as 1 and 0
// To see this is true, uncomment the following line and refresh the page
// smartCar = true;

// -------SEVEN-------
// false (0) plus true (1) = 1!
// There's one primitive type left to check out
// While undefined is the accidental absence of a value,
// null is the intentional absence of a value
// If null is the absence of a value, what number might it represent?
// Uncomment the following two lines and refresh the page
// banana = null;
// smartCar = null;

// -------EIGHT-------
// One more fun case to test out
// Uncomment the following lines and think about what the answer will be before you refresh the page
// banana = "77";
// smartCar = 77;

// -------NINE-------
// Try different combinations of numbers, strings, null, undefined, and booleans
// Have fun and don't worry too much about remembering how all of this works
// Explore and be curious!

// ---- END OF LESSON MATERIAL ---

var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;
var gravity;
var tweenSpeedInMs = 500;

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
