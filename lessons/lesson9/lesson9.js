// ---- FUNctions Part Two!!! ----
// This lesson is going to cover a few things, so buckle your safety belt!
// We are going to talk about parameters in functions,
// passing functions as parameters,
// and how to access Phaser to do things toybox doesn't do.
// By the end, we'll have our alien, a slime, and health displayed as text
//
//
//
// -------ONE-------
// --An enemy appears!--
// We have created players, gems, coins, and more in our previous lessons
// Now, we are going to create a slime.
// In toybox, the syntax for adding something to the game is:
// toybox.add.nameOfTheThingYouWantToAdd();
// So using that same syntax, add to the game:
// -a slime
// -an alien
// in the game in the create() function below
// then refresh the page!
//
//
//
// -------TWO-------
// --Customizing with parameters--
// Ouch! Our lil' alien gets hurt right away
// because the slime and the alien both get spawned in the same place!
// Let's fix that by specifying the startingX for our alien.
// You already know how to create a playerOptions object from previous lessons
// Create one somewhere below that has at least a startingX property
// After you create it, we need to give it to our alien() function, so it knows where to spawn our alien.
// We give functions data to use by putting that data inside the parentheses when we call the function
// So if your playerOptions object is called playerOptions, the new call in create() would look like:
// toybox.add.alien(playerOptions);
//
//

// -------THREE-------
// --Displaying health / Output from functions--
// Did you notice that the alien dies after getting hit three times?
// We should let our players know that somehow!
// Let's use some text to tell our players how much health they have
// To display the player's health, we'll need a reference to the alien
// Functions can both take in data (via parameters) AND return data (when told to)!
// Let's use this aspect of functions to get a reference to our alien
// In order to get that reference, we can assign the result of toybox.add.alien() to a variable
// We'll use this variable in part 4
// HINT: it should look something like var alien = toybox.add.alien();
//
//
//
// --Text - it's not just for texing--
// Now that we have a reference to the alien, we can read it's health property
// And we can use a Phaser Text object to display it
// We'll be adding text via Phaser instead of toybox
// We add things to the game via Phaser much like we add things via toybox
// But instead of calling toybox.add.thingToAdd(), we call game.add.thingToAdd()
// The documentation for the object that adds GameObjects to Phaser lives here https://phaser.io/docs/2.6.2/Phaser.GameObjectFactory.html#text
// If we look at the text() function, we can see it takes multiple parameters (also called arguments)
// The most important thing to remember about having more than one parameter in a function is that ORDER MATTERS
// Just like arrays, the order in which parameters are passed into a function makes a big difference!
// All of these parameters are *optional*, meaning we don't technically have to provide them
// We definitely need to specify the string of text we want (our alien's health)
// So we'll have to fill out the first two parameters, too - the x and y position of the text.
// Let's try an x of 50, y of 100, and set the third parameter to alien(or whatever you named your alien variable).health
// Go ahead and use game.add.text() with those parameters in the create function below and refresh!
//
//
//
// --Where's our text?--
// I promise you the text is ACTUALLY THERE. And I will prove it
// Go to the commented out line in the create() function that looks like
// game.stage.backgroundColor = "ffffff";
// and uncomment that one (NOT this ^^^ one), then refresh!
//
//
//
// --Back in Black--
// Did you notice the problem with our text?
// Yes, by default our text is black and by default our background is black.
// So although the text was there, we couldn't see it!
// But what if we want to keep our black background?
// Delete the line you uncommented in the last step
// Now let's make our text white.
// Photon lets us customize our text using a style object
// We give the style object the properties we want to customize
// In this case, we want the property color
// The value of that property will be a string containing a hexidecimal representation of a color
// In hexidecimal, white is "ffffff", so so our object will look like:
// { color : "ffffff" }
// and we can pass that right into our
//
// -------FOUR-------
// --Callbacks - Calling a function without knowing what it does--
// The object that is returned is a Phaser object called a Sprite
// The documentation for the object can be found here https://phaser.io/docs/2.6.2/Phaser.Sprite.html
// If you look at its properties, you can see it has one called "events"
// This property is another Phaser object of type Events https://phaser.io/docs/2.6.2/Phaser.Events.html
// Events are like notifications on your phone - you got a text, someone liked your post, etc...
// But they let you DO SOMETHING when that event happens!
// Not only do you know about it, you get to have your own response to it
// We have added a custom event to the events object called
//
//
//
// -------THREE-------
// --Passing in arguments--
// Sometimes we want to pass data into our function
// So that we can do something with the data
// And make the function more flexible to work with different data
// In Javascript, we can pass data into a function whenever we want
// When we are passing in data, we call that data arguments
// To pass in arguments, we put a value or variable inside the parentheses
// when we call the function
// So sayHello(); becomes something like sayHello("Goodbye"); or sayHello(5);
// Try that now in our sayHello call and refresh!
//
//
// -------FOUR-------
// --Using the arguments--
// Well, isn't this the lesson of disappointment?
// Nothing new happened, did it?
// But here's the cool thing: You didn't break the game!
// So how do we use the argument we pass in?
// let's use a different function to demonstrate
// The declaration of this function is different
// because we put a word inside the parentheses
// Putting that word in there named the argument
// so we can use it just like a variable inside the fucntion
function sayTheArgument(pusheen) {
  console.log("The argument is " + pusheen);
}
// Try calling this function in create or preload and passing in an argument
// Then refresh!

var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;
var settings = {
    gravity: 980,
    plugins: ["alien", "slime"]
};

function preload() {
    toybox = new Toybox(game, settings);
    toybox.preload();
}

function create() {
    toybox.create();
    toybox.add.slime();
    var alien = toybox.add.alien();
    game.add.text(50, 100, alien.health);

    // game.stage.backgroundColor = "ffffff";
}

function update() {
    toybox.update();
}
