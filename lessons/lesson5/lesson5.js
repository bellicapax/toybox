// THE OBJECT OF MY AFFECTION
// Now it's time to learn one of the most VERSATILE parts of Javascript:
// Objects!!!
// Objects are like arrays in that they can store a nearly unlimited amount of data
// inside of just one variable, but the way that you access that data is different
// Arrays depend on you knowing (or not caring about) the order of the data
// in order to retrieve it or reassign it
// Objects, on the other hand, use names to retrieve and assign data

// -------ONE-------
// --Declaring an object--
// To declare an object in Javascript, you declare a variable and assign it to curly brackets
var alienOptions = {};
var mushroomOptions = {};
// Right now, there's no data in our object, but it is a valid object
// Just like arrays, you can assign data in the declaration or anytime afterwards
// We have been using objects to create the sprites in the game behind the scenes
// Now we will be explicitly creating and manipulating these options
// Go ahead and open index.html to see what happens with our empty objects

// -------TWO-------
// --Assigning data in the declaration--
// Poor little one can't move!
// Let's put some data in for our alien and help them out!
// We can assign data in the declaration by giving the data a key and a value
// The value comes after the key and a colon separates the two
// The key and value together are called a property
// The key is the name of the property
// The value is the data tied to that property
// If we add multiple properties, we must separate them with commas
// Uncomment the next line and refresh!
// alienOptions = {speed: 100, jumpForce: 250};


// -------THREE-------
// --Adding data with dot notation--
// The alien could move because other code we have written
// was expecting properties named speed and jumpForce and
// expecting both of those properties to be numbers.
// We can add whatever data we want to our object,
// but only properties that our code is expecting will be used right now.
// Adding properties to objects is done in a couple standard ways
// One of the easiest is called "dot notation"
// It just means you put a dot at the end of the object name
// and then put the property name right after the dot
// You can think of it as accessing a variable inside a variable
// Uncomment the next line and see what happens.
// alienOptions.scale = 2;

// -------FOUR-------
// --Adding our own data--
// Now that you know what dot notation looks like,
// Try adding a property to alienOptions
// In the line below, add some property and give it a value
// Verify that it worked by refresing the page
// and inspecting it in the console (ask your neighbor if you forgot how)


// -------FIVE-------
// --Assigning data with brackets--
// We can also add a new property by using square brackets like an array,
// BUT instead of a number, we pass in the name of the property as a string
// Uncomment the line below and refresh!
// alienOptions["startingX"] = 320;

// -------SIX-------
// --Getting and Setting--
// Setting a property that already exists is accomplished
// in the same ways that we just learned to add properties:
// we can either use dot notation or square brackets and a string
// and assign that to our new value
// We can also GET the value just by using the same
// two methods of dot notation and square brackets
// Read the next line and make sure you understand what it means
// alienOptions["speed"] = alienOptions.startingX;
// Once you understand or ask for help, uncomment the previous line and refresh!

// -------SEVEN-------
//--Objects inside Objects (Objectception)--
// Like arrays, objects can contain anything a variable can hold,
// including other objects!
// To illustrate this example, we will bind the player controls to new keys
// We use keycodes to do this - numbers that represent keys on the keyboard
// copy the following url and open it in a new tab:
// http://keycode.info/
// This website is one easy way to find the keycode we are looking for
// Now, let's add a new object to our player options object
// Uncomment the next line. Change the numbers to other keycoes if you want and refresh!
// alienOptions.controls = { left: 65, right: 68, jump: 87};

// -------EIGHT-------
// --Accessing properties on objects in objects--
// We can use dot notation or square brackets or a combination of the two
// to get properties on our objects that live inside other objects
// Uncomment all the following examples and make sure you understand how they all work
// alienOptions["controls"].left = 90;
// alienOptions.controls["right"] = 67;
// alienOptions.controls.jump = 83;
// alienOptions["controls"]["newUnusedProperty"] = "I am a very interesting string. Why won't someone use me?";

// -------NINE-------
// --Customize!--
// Now that you know how to create and manipulate objects,
// take a look at the following references for the player
// and mushroom options objects and customize the values to your heart's content!
// The keys are on the left side of the colon
// The value types are on the right side and any restrictions or explanations are in parenthesis
// When you've tried different ways of customizing the player,
// put all your player custonizations in a declaration and post it into the slack channel!
// REFERENCE FOR PLAYER
// var alienOptions = {
//     startingX : number,
//     startingY: number,
//     color: string ("green", "pink", or "blue"),
//     jumpForce: number,
//     speed: number,
//     scale: number,
//     allowGravity : boolean,
//     bounce: number,
//     drag: number,
//     controls : {
//        left: number (keycode),
//        right: number (keycode),
//        jump: number (keycode)
//     }
// };
// REFERENCE FOR MUSHROOM
// var mushroomOptions = {
//     startingX : number,
//     startingY: number,
//     color: string ("red", "yellow", "purple", or "blue"),
//     scale: number,
//     allowGravity : boolean,
//     bounce: number,
// };

var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;
var settings = {
    gravity: 980,
    plugins: ["alien","mushroom"]
};

function preload() {
    toybox = new Toybox(game, settings);
    toybox.preload();
}

function create() {
  toybox.create();
  toybox.add.alien(alienOptions);
  if(typeof(mushroomOptions.startingX) == "undefined"){
    mushroomOptions.startingX = 50;
  }
  toybox.add.mushroom(mushroomOptions);
}

function update() {
    toybox.update();
}
