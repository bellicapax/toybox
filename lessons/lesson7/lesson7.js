// ---------- LESSON 7: Loops ----------

// In this lesson we're going to learn how to write loops!
// We're going to be doing all of our work inside the create function for this lesson,
// So you can skip down to line 36 ...

var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;
var settings = {
    gravity: 980,
    plugins: ["alien","gem"]
};

function preload() {
    toybox = new Toybox(game,settings);
    toybox.preload();
}

function create() {
    toybox.create();

    var playerOptions = {
        startingX : 100,
        startingY: 100,
        color: "pink",
        jumpForce: 300,
        speed: 100,
        scale: 1
    }

    player1 = toybox.add.alien(playerOptions);

    // So loops are probably one of the most important tools a programmer has,
    // because they are the most basic way to get your program to execute code multiple times in a row.
    // Below, on line 45 we have an array called 'gemsArray.'
    // That array is filled with the colors of a group of gem game-objects we want to create in our game.
    // Now, of course, we could just write out the line of code to create those one at a time.
    // But that approach has a lot of downsides.
    // It would mean writing a lot of repetetive code, and it makes our code less flexible.
    // Instead, we'll use a loop to create lots of gems at once!

    var gemsArray = ["red","green","green","blue","yellow","red","blue"];

    // So we're declaring a variable here called 'counter.'
    // It will be used just like the name sounds. It's a counter to tell how many times we've run this loop.

    var counter = 0;

    // We're creating a while loop here.
    // A while loop is one of the simplest kinds of loops.
    // It means WHILE (this expression) evaluates true { execute this code. }
    // In other words, as long as the expression in parantheses is true,
    // the code inside the curly brackets will be executed.
    // And when that code is completed, if the expression is STILL true, it will execute that same code again.
    // And when that code is completed, if the expression is STILL true, it will execute that same code again.
    // And when that code is completed, if the expression is STILL true, it will execute that same code again.
    // And when that code is completed, if the expression is STILL true, it will execute that same code again.
    // Until that expression does NOT evaluate as true.

    // So on line 65, we're checking to see if our counter is less than or equal to the length of our gemsArray minus 1.
    // (It's minus one because the counter represents how many times the loop needs to run, and we're starting at zero.)

    while (counter <= gemsArray.length - 1){

        // Now as long as that condition remains true, our loop will execute this code again and again.

        var gemOptions = {

            // So we're creating a gemOptions object,
            // and we set the color to the index of our gemsArray that matches our counter.

            color: gemsArray[counter],

            // Then we set the startingX based on counter as well.
            // (250 is where we want our row to start, 16 is how wide a gem is.)

            startingX: 250 + (counter * 16),
            startingY: 450
        };

        // Then we add the gem using toybox and our options object.

        toybox.add.gem(gemOptions);

        // And now we increase our counter by one.
        // You might not recognize the '++' operator, but that's ok.
        // It just means 'increase this number by one.'
        // Line 93,94, and 95 all do exactly the same thing.
        // (Of course, two of them are commented out, b/c we only want our counter to increase by 1, not 3!)

        counter++;
        // counter += 1;
        // counter = counter + 1;
    }

    // At this point, you can pause and run this lesson in the broswer just to see what it does.

    // ... /(-_-)> (I'll wait) ...

    // See, we made a row of gems.
    // If you want to, go ahead and change the order or number colors in the gemsArray and re-run it.

    // Now, while loops are great. And you can write while loops that will get the job done in most scenarios.
    // But in javascript, you're probably see 'for' loops used more frequently.
    // Now, I'm going to show you a 'for' loop that does almost the EXACT same thing, but a little cleaner.
    // Check out lines 111-118.

    // for (var reverseCounter = gemsArray.length - 1; reverseCounter >= 0; reverseCounter--) {
    //     var gemOptions = {
    //         color: gemsArray[reverseCounter],
    //         startingX: 250 + (reverseCounter * 16),
    //         startingY: 350
    //     };
    //     toybox.add.gem(gemOptions);
    // }

    // Ok, so that probably looks a little confusing, but I promise it's pretty simple.
    // So a 'for' loop is a loop that does someting FOR however many times.
    // So on line 111, we're starting a for loop and telling it three things.
    // We're establishing a variable called reverseCounter that will keep track of how many times we do this.
    // We're assigning this variable to the length of our array minus 1.
    // (This variable is often called the index, and you'll see a lot of loops that just call it 'i')
    // Then we establish an end conistion.
    // We want this loop to end when reverseCounter is less than or equal to zero.
    // Lastly, at the end of every loop, we want to subract one from reverseCounter.
    // Otherwise, the code inside the loop is exactly the same! (except the gems are higher.)

    // Go ahead and uncomment lines 111-118 and run the lesson in the browser.
    // You should see a second identical row of gems appear.

    // Now why would you do it this way? Mostly just to write clearer code.
    // It has the counter variable built into to it, so you don't have declare it outside the loop.
    // It's smart to limit how many global variable you leave lying around.

    // You might wonder why that for loop counts down instead of up...
    // I'll let you in on a tiny secret: counting down in Javascript is A TEENSY TINY bit faster than up.
    // It probably won't matter if you're looping through 5 items,
    // but if you're looping through 80,000 items (which can happen) you want it to be as fast as possible.

    // ------ END OF LESSON MATERIAL -----

}

function update() {
    toybox.update();
}
