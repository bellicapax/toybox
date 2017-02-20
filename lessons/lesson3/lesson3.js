// ---------- LESSON 3, Part 1: What you're using. ----------

// At this point, we should clarify the different tools you're using in these exercizes, so that you can better understand how to use them.
// In all of the exercizes we've built for you, there are three different components acting on your code.
// It's important that you understand how these components work together.
// That way when you are building your own project you can effectively use them together,
// and you'll be better equipped to debug errors you encounter.

// ---- Component 1: JAVASCRIPT ----
// Javascript is the language you are writing in these exercizes.
// (Sometimes you may see Javascript called ECMAscript. Don't worry, it's the exact same thing.)
// It's a very commonly used language. Almost every website you visit is running some Javascript on it.
// Every line of code you write in these exercizes will utilize Javascript.
// Statements like 'var' and 'function' are good examples of core Javascript functionality.

var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

// ---- COMPONENT 2: Phaser.Js ----
// Phaser.js (or just Phaser) is a Javascript FRAMEWORK we are using.
// A Javascript Framework is a program or set of tools written in JS to help programmers like you build things quickly or more easily.
// (Node.js or JQuery are two examples of other popular frameworks you might hear about.)
// There are lots of different frameworks to help with different tasks. Phaser is made for building games.
// Frameworks made for building games are often called 'game engines.'
// (JavaScript written without using or requiring a framework is often called 'Vanilla JavaScript.')
// Frameworks typically add a lot of commands or statements unique to them, so each one takes a little while to learn.
// Phaser in particular is very robust framework that can do a lot of things, and has lots of functionality you can learn.

// So in lines 16-20, what we're doing is we're declaring a new global variable called 'game'
// and assigning a copy of the Phaser framework to that variable.
// We're also passing an object to the Phaser framework that helps it know how to boot up.

// We haven't talked in detail about objects yet. For now, all you need to know is that objects are collections of variables.

var toybox;
var settings = {gravity: 980};

// ---- COMPONENT 3: Toybox ----
// So Toybox is a set of scripts we've created just for this class.
// Toybox is written in Javascript and requires the Phaser framework.
// Toybox is just designed to help make creating these exercizes easier, and to allow you to quickly start learning the Phaser game engine.
// Toybox intentionally does not add a lot of new functionality to Phaser, just a few shortcuts.
// I would not call Toybox a framework, just because it is so specific, but it could be if we developed it further.

// So in lines 38-39, all we are doing is declaring a new variable 'toybox', which we will use later,
// and also declaring the object 'settings' which we will eventually pass to Toybox.

// ---------- LESSON 3, Part 2: Basic Phaser functions ----------

// So you may have noticed when we set up Phaser in lines 16-20 we gave it three settings 'preload', 'create', and 'update.'
// Those are the names of three core functions in Phaser which run the game engine.
// You'll need to use these functions every time you create games with Phaser.

// We'll talk about functions in more detail later, but for now here's what you need to know.
// Functions are pieces of code that instead of being run right away, are only ran when they are called by other code.
// Functions often can be run again and again, as many times as needed.

function preload() {
    toybox = new Toybox(game,settings);
    toybox.preload();
}

// ---- PRELOAD ----
// 'preload' is a function that Phaser runs only once before anything else.
// A common example for what would go in preload is any graphics or sound files would go here,
// that way those files can be loaded into memory for Phaser to use before they are needed.

// So in lines 61-64, what we're doing is defining a function called 'preload.'
// Phaser knows to run this function when it is preloading because we gave it this function name when we booted Phaser up.
// Inside this function, we are assinging our variable 'toybox' to a new copy of the Toybox pseudo-framework.
// We're passing two variables to 'toybox,' the variable 'game' which is a copy of Phaser, and 'settings.'
// Then we're telling 'toybox' to run a function that is part of it, ALSO CALLED 'toybox.preload'
// Note that 'preload' and 'toybox.preload' are NOT the same function, we just have named them similarly because they do similar things.
// 'toybox.preload' is where we're loading all of the graphics being used in these exercizes.

// It's important that we only booted up toybox AFTER Phaser was running, because it requires Phaser.

// So to recap, when Phaser runs 'preload' it boots up Toybox to the variable 'toybox,' and then runs 'toybox.preload.'

var playerOptions;
var coinOptions;

function create() {

    playerOptions = {
        startingX : 100,
        startingY: 100,
        color: "pink",
        jumpForce: 300,
        speed: 100,
        scale: 1
    }

    mainPlayer = toybox.add.alien(playerOptions);

    coinOptions = {
        startingX: 320, 
        startingY: 100, 
        dX: (toybox.diceRoll(400) - 200), 
        dy: -200
    }

    //toybox.add.coin(coinOptions);
}

// ---- CREATE ----
// 'create' is a function that Phaser runs only once in order to initially build the game.
// So you would put things in 'create' that you want to only have happen to set up the game, before the player get to do anything.

// So, in lines 83-106, what we're doing is we're declaring ANOTHER function, called 'create.'
// Again, we already told Phaser the name of this function when we booted Phaser up.
// Unlike 'preload,' there's no 'toybox.create.'
// That's because toybox doesn't have anything that HAS to be added to a game. It's a bunch of shortcuts you CAN add to a game.
// Inside this function, we're assigning an object to the variable 'playerOptions,' and filling the object with some data.
// Some of this should look a little familiar from Lesson 1: you can probably guess what some of the information in 'playerOptions' does.

// Now, on line 97, we're calling a function from the 'toybox' object we created in 'preload.'
// We're calling 'toybox.add.alien,' and then we're passing it the object 'playerOptions.'

// WHEW! We've done a lot of reading in this lesson so far.
// Why don't you pause, and run this program in your browser so far?

// ... /(-_-)> (I'll wait) ...

// OK! So that should've looked familiar: We made a little pink Alien player you can control.
// Because we added that line of code in the 'create' function, Phaser added that pink alien player object to the game for us!
// That little alien is called a GAME-OBJECT.
// Now, because 'toybox.add.alien' is part of the toybox object, that's a shortcut created specific for this class, 
// and not a part of Phaser itself.
// However, Toybox is designed to work just like Phaser. So making game-objects in Phaser is very similar.

// Shall we add another game-object? ...I think so.

// In lines 99-104, we're assigning a new object to 'coinOptions.'
// Now un-comment line 106.
// On line 106, we're calling another toybox shortcut: this one creates a coin game-object, using 'coinOptions.'

// OK, save and run the lesson in the browser again.

// ... /(o_o)\ (Check it out!) ...

// So, a coin should have appeared onscreen with your alien player!
// Toybox coin game-objects can be collected by player game-objects.

function update() {
    toybox.update();

    // toybox.add.coin(coinOptions);
}

// ---- UPDATE ----

// So obviously, sometimes you need the game to change, or notice changes AFTER it has started up.
// That all will be done through 'update.'
// 'update' is a function that Phaser runs multiple times a second in order to update the game state.
// 'update' is the main way you access the GAME LOOP, which is basically the functions that control the game.
// The game loop is the functions that a game engine constantly runs over and over to check what the player is doing and how the game should react.

// So, in lines 147-151, what we're doing is we're declaring ANOTHER function, called 'update.'
// Again, we already told Phaser the name of this function when we booted Phaser up.
// Then inside that function, we call a function that is a part of 'toybox', called 'toybox.update'
// That function makes sure all the toybox game-objects act like they're supposed to.
// For example, 'toybox.update' includes the functions that check to see what keys you're pressing 
// and tells the player game-object where to go, and checks to see if a player has touched a coin and removes it.

// Now, un-comment line 152.
// Notice that line of code is the EXACT SAME line of code we un-commented in 'create.'
// So the difference is that that 'create' will call line 106 once, and 'update' will call line 150 multiple times a second, continuously.
// Let's save and run the lesson in the browser again.

// ... \(@_@)/ (WHOOAAAAA) ...

// Look at ALL OF THOSE COINS!
// So, each time the update function runs, it creates a new coin game-object.
// You might notice that if you let those coins pile up, the game will eventually slow down.
// That's because each game-object has to run code on it to make sure it acts properly, and the more objects are in the game,
// the more code has to been run. After a while, you'll start to stress your game engine to it's limits.

// ----- END OF LESSON MATERIAL -----

function render(){
    var coinScore = mainPlayer.stats.score || 0;
    game.debug.text(coinScore,10,30)
}
