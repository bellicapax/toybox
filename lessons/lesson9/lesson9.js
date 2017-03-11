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
// game.stage.backgroundColor = "#ffffff";
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
// In this case, we want the property fill - to fill our text with color
// The value of that property will be a string containing a hexidecimal representation of a color
// In hexidecimal, white is "#ffffff", so so our object will look like:
// { fill : "#ffffff" }
// (If you want a different color, you can find color codes at http://www.colorpicker.com/)
// and we can pass that right into our call to add the text after the string we want to display:
// game.add.text(50, 100, alien.health, { fill : "#ffffff"});
// Since we're passing in the object as a parameter, we don't *have* to assign it to a local variable.
// Go ahead and insert that into your call below and refresh!
//
//
//
// --Updating our text--
// So now we can see our text, but it's not updating when we get hit
// In order to update it, we need a reference to that text Game Object we have created,
// So let's go down to the create() function and assign it to a variable like we did for the alien - something like:
// var healthDisplay = game.add.tex(50, 100, alien.health { fill: "#ffffff"});
// Now that we have that variable, we need to update its text property
// Let's try doing that in update()
// Add a line in update() that sets the text property of your healthDisplay object to alien.health and refresh!
//
//
//
// --Scope it out!--
// Whoops! Did you get an error!?
// Well, that was kind of on purpose (^_^)
// It gives us a perfect opportunity to talk about scope.
// Scope means "What sections of the code know about a particular variable?"
// So in this case, the update() function didn't know about healthDisplay or alien.
// Even though we see them being assigned in create(),
// the interreter discards them at the end of that function because they are declared INSIDE the function
// In Javascript, functions are scope for variables declared with var.
// This means that for a variable declared inside a function,
// Everything inside the curly braces that define a function's beginning and ending knows it exists,
// but everything *outside* those braces thinks it doesn't exist and will throw an error
// In our case, we can fix that by declaring our variables OUTSIDE the scope of the function.
// So let's declare them outisde create() or any other function like:
var alien;
var healthDisplay;
// AND THEN we must remember to remove the "var" from the variables that are inside the create() function
// var tells the interpreter we are creating a NEW variable and if we didn't remove them,
// it would overwrite the ones we just declared and would still keep all the info we assign
// inside the scope of the function.
// Go ahead and declare our variables outside the function
// and remove the var for each of them inside the create() function - then refresh!
//
//
//
// -------FOUR-------
// --Events - Calling a function without knowing what it does--
// Hooray! Our alien's health is displayed and updates.
// It's updated every frame, which really isn't completely necessary,
// So let's look at one more different way to do the same thing.
// FIrst, take the line of code we are using in update(),
// Remove it from update() and place it inside a new function called something like updateHealthDisplay()
// If we aren't calling it every frame in update(), when do we want to call it?
// Well, we know when we want to call it - every time the alien is hurt
// So let's take a look at the Game Object that lives inside our alien variable:
// The object that is returned is a Phaser object called a Sprite
// The documentation for the object can be found here https://phaser.io/docs/2.6.2/Phaser.Sprite.html
// If you look at its properties, you can see it has one called "events"
// This property is another Phaser object of type Events https://phaser.io/docs/2.6.2/Phaser.Events.html
// Events are like notifications on your phone - you got a text, someone liked your post, etc...
// But they let you DO SOMETHING when that event happens!
// Not only do you know about it, you get to have your own response to it
// We have added a custom event to the events object called onHit
// In Phaser, we add our own function to be called when the event happens
// by using the syntax eventWeCareAbout.add(functionWeWantToFire);
// so for our example. after we assign our alien object, we can do something like:
// alien.events.onHit.add(updateHealthDisplay);
// Notice in this case, we don't want to CALL the function inside the other function;
// Calling the function would return its value
// (in our case, since we don't explicitly return anything, it will return undefined)
// So when we pass a function as a parameter, we want to omit the parentheses
// Try adding our function to onHit below in our create() function and refresh!
//
//
//
// -- CHALLENGE --
// See if you can use your new understanding of Phaser documentation
// to use a Group to make the healthDisplay follow the player around!
// https://phaser.io/docs/2.6.2/Phaser.Group.html
// HINT: you'll need to creat this class object by using the keyword new in front of it:
// var myGroup = new Phaser.Group(someParameter1, differentParameter, BestParameter);

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
    alien = toybox.add.alien();
    healthDisplay = game.add.text(50, 100, alien.health, { fill : "#ffffff"});
    alien.events.onHit.add(updateHealthDisplay);
    // game.stage.backgroundColor = "#ffffff";
}

function update() {
    toybox.update();
}

function updateHealthDisplay() {
  healthDisplay.text = alien.health;

}
