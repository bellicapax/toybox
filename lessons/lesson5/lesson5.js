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
// Go ahead and open index.html to see what happens with our empty objects

// -------TWO-------
// --Assigning data in the declaration--
// Poor little one can't move!
// Let's put some data in for our alien and help them out!
// We can assign data in the declaration by giving the data a key and a value
// The key and value together are called a property
// The key is the name of the property
// The value is the data tied to that property
// Uncomment the next line and refresh!
// alienOptions = {speed: 300, jumpForce: 250};


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
// --Getting and Setting--

// -------SIX-------
// --Assigning data with brackets--

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
//      left: number (keycode),
//      right: number (keycode),
//      jump: number (keycode)
//     }
// }

var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;
var settings = {
    gravity: 980
};

function preload() {
    toybox = new Toybox(game, settings);
    toybox.preload();
}

function create() {
  toybox.add.alienPlayer(alienOptions);
  if(typeof(mushroomOptions.startingX) == "undefined"){
    mushroomOptions.startingX = 50
  }
  toybox.add.mushroom(mushroomOptions);
}

function update() {
    toybox.update();
}
