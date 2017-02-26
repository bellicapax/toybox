
// ---------- LESSON 6: Conditionals in the game loop ----------

// Alright, this lesson we're going to work things a little different.
// We're going to quickly go over how the game starts up,
// Then we're going to run it,
// See what it's doing,
// and we're going change it's behavior to solve a problem.

// ᕦ(ò_óˇ)ᕤ Let's debug this code!!

// OK, so here we're starting up phaser, and telling it what functions it should look out for.
// Notice that we define the SIZE of the Phaser game here.
// Our game is 640 wide, and 480 pixels tall.

var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});

// Here we're defining toybox and giving it some settings.

var toybox;
var settings = {gravity: 980, plugins: ["alien", "coin"]};

// This is the Phaser preload function.
// Before Phaser creates anything, it's going to boot up Toybox and run toybox's preload function.

function preload() {
    toybox = new Toybox(game,settings);
    toybox.preload();
}

// This is the Phaser create function.
// When Phaser creates the game, we declare an object called 'playerOptions,'
// we fill it with some info about our player avatar,
// then we use toybox to create an alien player character, passing along that options object as an argument.

function create() {
    toybox.create();

    var playerOptions = {
        startingX : 100,
        startingY: 100,
        color: "green",
        jumpForce: 300,
        speed: 100,
        scale: 1
    }

    toybox.add.alien(playerOptions);
}

// This is the Phaser update function.
// Before the function, we're declaring a global variable called 'coinsInGame,' which is an array.
// Everytime Phaser updates the game, we declare an object called 'coinOptions,'
// we fill that object with some information about the coin we want to make,
// then we use toybox to create a coin using 'coinOptions.'

function update() {
    toybox.update();

    var coinOptions = {
        startingX: 320, 
        startingY: 100,
        dy: -200, 
        dX: (Phaser.Math.between(-200,200))
    }

    toybox.add.coin(coinOptions);
}

// OK. Seems fine so far.
// Let's pause, and run this example in the browser.


// ... /(-_-)> (I'll wait) ...


// \(⨀_⨀ )/   WHOAH THAT'S A LOT OF COINS

// That's too many coins. Our little alien is getting pelted, and the game is slowing down.

// Alright. So the problem is this:
// Right now, our game is making a coin EVERY time Phaser updates.
// We need it only make coins on SOME of the updates.
// In order to do that, we're going to need to use some kind of conditional.

// A conditional is a piece of code that means
// 'if the following conditions are true, execute the following block of code.'
// Line 93 below is an example of a basic conditional.

// if (true) { console.log("CONDITIONAL TRIGGERED"); };

// An 'if' statement is the most basic and common conditional in Javascript.
// There are other kinds, but an 'if' will usually get the job done just fine.
// in javascript, if statements are built with the conditions needed to be met inside of parentheses
// and the block of code to be executed inside of curly brackets.
// So line 93 is saying 

// 'if the statement (true) evaluates to be true,
//  then { add the string "CONDITIONAL TRIGGERED" to the javascript console }'

// Of course, this conditional will ALWAYS be triggered because the value 'true' will always evaluate to true.

// OK, so for this lesson, you're going to be doing more than just un-commenting code.
// You're going to be be editing and writing code inside the functions we've already defined here.

// Please copy line 93, and add it to the 'update' function, making sure it's uncommented.
// Go ahead and paste that code onto line 62.

// Now let's pause, and run this lesson in the browser again.


// ... /(-_-)> (I'll wait) ...


// Now, visually, nothing has changed. But if you open up the console,
// you will see that 'CONDITIONAL TRIGGERED' has been being added every time Phaser updates.
// Again, that's happening because that conditional will ALWAYS trigger.

// Now, for laughs, let's tie our coin generation to this goofy conditional we've got.
// So what I want you to do is to add new lines (press Enter)
// on line 62 inside the block of code that conditional is executing.
// Technically this isn't part of the code, this just helps us read and understand the code being executed.
// When you're done, the conditional should take up lines 62-64, and look something like this:

//    if (true) { 
//       console.log("CONDITIONAL TRIGGERED"); 
//    };

// Then we're going to move all the code defining coinUpdate and adding the coin to INSIDE the 'if' statement.
// So select all that (probably lines 65-72 now) and move it inside of our curly brackets.
// When you're done, it should look something like this:

//    if (false) { 
//       console.log("CONDITIONAL TRIGGERED");
//
//       var coinOptions = {
//          startingX: 320, 
//          startingY: 100,
//          dy: -200, 
//          dX: (Phaser.Math.between(-200,200))
//       }
//   
//       var newCoin = toybox.add.coin(coinOptions);
//   };

// Now, if you like, you may want to stop here, save, and run this lesson in the browser again.
// But I will tell you right now, it will run EXACTLY the same.
// The if statement will ALWAYS be triggered,
// the message will ALWAYS be logged,
// and a coin will always be created.
// It's just that now we've made all those things dependant on our if statement.

// Now, let's change the expression that conditional is evaluating.
// On line 62 (in the parentheses of our if statement,) change 'true' to 'false.'

// Now save, and run this lesson in the browser again.

// ... /(-_-)> (I'll wait) ...

// NO COINS AT ALL.
// That's because that conditional will NEVER trigger now, because 'false' always evaluates false.
// So no coins are ever made, and no message gets logged.

// ᕦ(e_e )\ ...hmmm... We need something that triggers somewhere between never and always to make our coins.

// Let's go over how those coins are made for a minute.
// Please review those lines of code (probably 65-70 now).

// So in these lines, we're setting some basic info about these coins.
// We're setting the X and Y positions of the coin, which control where it shows up on screen.
// The startingX is being set to 320 (the exact middle of our 640 wide game,)
// and the StartingY is being set to 100 pixels from the top of the screen.
// Then we're also setting dX and dY, which is the horizontal and vertical speed of the coin.
// SIDENOTE: (dX and dY are physics terms that mean 'change in', or 'difference')
// So dY is set to -200, which gives each coin a vertical speed of 200 in the upward direction.
// and dX is set to... 

// Wait, what is that? -(ó_ò )??

// Lolz, sorry, I know what that is. That is a random number generator.
// So 'Phaser.Math.between' is handy function that Phaser has.
// It returns a random number between the two arguments provided.
// So here, we're setting the horizontal speed of each coin to a random number between -200 and 200.
// That's what makes that fountain effect for the coins:
// all the coins have the same vertical speed, and a random horizontal speed.
// So sometimes the coins go left, and SOMETIMES they go right...

// ε(⨀_⨀ )з .oO( '...SOMETIMES...' )

// WHOA, I've got an idea!
// What if we use a random number to determine if we should generate a coin?
// That way it only happens SOMETIMES at random?

// var shouldThereBeACoin = (Phaser.Math.between(1,400) >= 380);

// so the above line of code declares a variable 'shouldThereBeACoin,'
// and assigns it a boolean expression which evaluates a random number between 1 and 400.
// If the random number is greater or equal to 380, shouldThereBeACoin will be true.
// Otherwise, shouldThereBeACoin will be false.

// Go ahead and copy that line of code (probably 200 now).
// We're going to paste it into our update function,
// on a new line before the conditional, after line 61.
// Make sure it's uncommented after you've added it in.
// Now let's change the expression our conditional is evaluating from 'false' to 'shouldThereBeACoin.'

// Now save, and run this lesson in the browser again.


// ... /(-_-)> (I'll wait) ...


// \(*∩_∩* )/  HOORAY! If everything worked, that should be a much more reasonable amount of coins!

// So now, the update function is still running all the time, but we've created a conditional
// that randomly triggers only SOMETIMES so we can make coins without flooding the screen with them.

// Hopefully, you have the start of an idea of what 'if' statements can do, and how you could use them
// in your game!

