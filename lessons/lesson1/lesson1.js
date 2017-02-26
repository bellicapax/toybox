//  Variables are data that you can store in memory to access and manipulate.
//  In plain english, a variable is a piece of information your program records so it can track and change it.

//  These are some variables!
// The command 'var' declares a variable in javascript.
// This just means that javascript now knows that variable name (after the space) can reference some kind of value.

var player;
var playerSize;

// The above variable is declared, but it isn't defined (it does not yet reference a specific value)

// A single equals sign is used to assign a variable.
// Assigning a variable saves the value on the right side of the equals sign to the variable name on the left.
// Assignment is what defines the variable.
// Note that I don't need to use var to assign 'size' to 2, because I already declared 'size' as a variable above.

playerSize = 2;

// For brevity, you can also declare and assign your variable in the same line using var.

var playerSpeed = 100;
var gravity = 980;
var playerJumpForce = 300;

// So far, all of the data we've assigned for our variables has been numbers.
// But there are other types of data we can assign to variables.

// Variables can store Strings. A string is a sequence of text characters: this is how you would store words 
// or even longer phrases containing letters, numbers, punctuation  marks, and spaces.
// Strings are noted by enclosing the character data in either single or double quotes. 
// We're using double quotes here. Whatever you use, try to stay consistent. 
// You must use the same type of quote at the beginning and end. 
// Mixing it up on different strings doesn't break any rules per se, but consistency is a matter of style. 
// Do future you a favor, and use the same quote marks throughout. Code style makes a big difference in readability.
var playerColor = "green";

// Variables can store Arrays. An array is an ordered list of data. This array contains three strings.
// Arrays are notated using square brackets, and with commas separating the entries in the array.
var validColors = ["green", "blue", "pink"];

// Variables can also store Booleans. A Boolean is a binary value: it's either on or off.
// There are only two boolean values: true and false!
var shouldThereBeAPlayerObject = true;

// Variables can also store Objects. Objects are like arrays, but not ordered.
// You'll learn much more about objects later, but for now know that they're notated using curly brackets.
var uselessObject = {};

// You can name your variable PRETTY MUCH whatever you want.
// You can't use characters that Javascript uses for operations, like (),!,'":?
// You cannot start the name with a number.
// You also can't name your variable the same thing as a Javascript command ("reserved word"), like 'switch' or 'function'.
// Otherwise you can name your variables how you like.

var Tfdsf$dvFROG = "This is a valid variable name, but don't ever name your variables like this."
var aNiceString = "The convention in JavaScript is to name variables using no spaces or underscores, with the first letter of each word capitalized except for the first."

// It is IMPORTANT that you name variables things that make sense in the context they are used.
// You want anyone who is reading your code to know what the variable is used for just by the name.
// You'll see how this works in a minute.

// So that's how you assign and name variables!
// Now let's see what they do!
// Go ahead and run the index.html file for this lesson in your browser.
// A little alien character should appear. You can move it with the arrow keys and the spacebar.

// Javascript used the variables we declared to create that character.
// Now try and change some of the variables above, save, and reload the game.
// You should be able to tell how the game will be affected by the name of the variables you change.

// (changing validColors won't add more colors, though. We'll see that later.)

// ---- END OF LESSON MATERIAL ---

var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;
var settings = {
    gravity: gravity,
    plugins: ["alien","mushroom"]
};

function preload() {
    toybox = new Toybox(game,settings);
    toybox.preload();
}

function create() {
    toybox.create();
    if (!validColors.indexOf(playerColor)) {
        playerColor = "green";
    }

    var playerOptions = {
        startingX : 100,
        startingY: 100,
        color: playerColor,
        jumpForce: playerJumpForce,
        speed: playerSpeed,
        scale: playerSize
    }

    if (shouldThereBeAPlayerObject) {
        player = toybox.add.alien(playerOptions);
    }

    toybox.add.mushroom({
    	startingX: 50,
    	startingY: 0,
    	color: "red"
    })
}

function update() {
    toybox.update();
}
