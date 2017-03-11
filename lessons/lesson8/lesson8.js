// ---- FUNctions!!! ----
// Functions define a set of instructions that can be run with a single "call"
// Functions are useful three main reasons:
// -They keep you from typing the same code over and over again
// -They make your code more readable (when the functions are named thoughtfully!)
// -They let you store instructions in a variable!
//
//
// -------ONE-------
// --Declaring a function--
// So let's look at the structure of a function!
// We declare a function with the keyword "function"
// followed by the name of the function, parentheses, and a left curly bracket
function sayHello() {
  // Everything inside the brackets is the code that will run when you call the function
  // You can put almost anything in here
  // Right now, we only have this one line of code that will print "Hello!" to the console
  console.log("Hello!");
  // We end with the right curly bracket to tell the interpreter where the function code ends
}
// Go ahead and run the lesson (make sure to open the console!) to see what happens
//
//
// -------TWO-------
// --Calling a function--
// Did you notice anything strange?
// Where's the "Hello!"????
// Why didn't it print?
// Well, the computer doesn't run the function until we tell it to
// And we tell it to run the function by "calling" it
// To call a function, type the name of the function followed by parentheses
// Try calling our sayHello function inside our create or preload functions below
// And refresh!
//
//
//// -------THREE-------
// --Bring back the gems!--
// Do you remember the gems from the last lesson?
// We are going to put the code we used last time (more or less)
// Into a function here so that we can call it easily
// Let's look at it again briefly:
function createGems() {
  // Looping through our array of gem colors
  for (var i = 0; i < gemColors.length; i++) {
    // Setting some options
    var gemOptions = {
        color: gemColors[i],
        startingX: game.world.centerX - (gemColors.length / 2 * 16) + (i * 16),
        startingY: 450
    };
    // Creating a new gem Game Object and adding it to an array
    gemGameObjects.push(toybox.add.gem(gemOptions));
  }
}
// Now let's call it in create() and refresh!
//
//
// -------FIVE-------
// --Calling functions with in game buttons!--
// Buttons are a special kind of object in toybox
// They have an onPress() function that can do whatever
// the code inside the function says when you press it in the game
// We are going to give the red button a function:
function destroyGems() {
  // Loop through all the gem Game Objects we created
  for (var i = 0; i < gemGameObjects.length; i++) {
    // Make sure it wasn't destroyed in some other way (like collecting it)
    if(gemGameObjects[i] != null){
      // Destroy it (means completely remove it from the game)
      gemGameObjects[i].destroy();
    }
  }
}
// Remember up top when I said that functions can store code in a variable?
// Well, we are going to assign the destroyGems() function to a variable:
redButtonOnPress = destroyGems;
// It's as easy as that!
// Make sure you know the difference in syntax between:
// 1)Assigning a function to a variable
// And
// 2)Calling that function.
// Calling the function involves the parentheses
// Assigning the function to a variable does NOT
// I've made a convenient method to create some buttons
// Guess what it's called???????
// That's right - createButtons()
// Go ahead and call that function in the create() function
// Now refresh the page and jump on the red button!
//
//
// -------SIX-------
// --Calling functions in other functions--
// So destroying the gems is cool, but you can only do it once
// Let's do something more exciting!
// We'll let the red button destroy old gems AND spawn new ones
// To do that, our function will call two functions you've already seen:
function recreateGems() {
  destroyGems();
  // clear our array of gem Game Objects
  gemGameObjects = [];
  createGems();
  // clear our array of gem Colors
  gemColors = [];
}
// Now all we need to do is assign this new function to redButtonOnPress
// Do that in the line below and refresh:

// -------SEVEN-------
//--Creating gems and making your first function!!--
// Ok, so that didn't actually do anything new yet
// BECAUSE we haven't added new stuff to our gemColors array!
// So let's use a function to do that!
// We are going to assign the blue button a function
// That function will push the string "blue" onto the gemColors array
// Call the function something like addBlueGem
// Write the code in the lines below (add more if you need) and then continue reading



// Now uncomment the line below and assign your function to the variable
// blueButtonOnPress =
// Refresh to see what happens when you push the blue button then the red one!
//
//
// -------EIGHT-------
// --Finishing touches!--
// Now that you know how to add a blue gem,
// write a function that adds a green gem
// and one that adds a yellow gem,
// uncomment the lines below, assign your functions, and refresh!
// greenButtonOnPress =
// yellowButtonOnPress =
//
//
// -------CHALLENGE-------
// --Add a new plugin!--
// This challenge is pretty open ended!
// Just make one of your buttons create an object that isn't in the game yet!
// So far, we have aliens, gems, and buttons
// But if you look at your folder structure of this project,
// You'll see a plugins folder - each of those plugins is something you can add to the game!
// You'll have to add the plugin first in two places
// Let's say you want to add a spring!
// You would open the index.html file for this lesson and add after
// <script src="../../plugins/button.js"></script>
// You would add
// <script src="../../plugins/spring.js"></script>
// Then you would come back to this file and in the settings object below,
// you would add the string "spring" to the plugins array property
// Adding a spring is as easy as toybox.add.spring()
// Don't hesistate to ask for help if you get stuck!


var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;
var settings = {
    gravity: 980,
    plugins: ["alien","gem","button"]
};

var gemColors = ["blue","green","yellow"];
var gemGameObjects = [];
var player;
var redButtonOnPress;
var blueButtonOnPress;
var greenButtonOnPress;
var yellowButtonOnPress;

function preload() {
    toybox = new Toybox(game, settings);
    toybox.preload();
}

function create() {
  toybox.create();

  player = toybox.add.alien({
      startingX : 250,
      startingY: 100,
      color: "pink",
      jumpForce: 300,
      speed: 100,
      scale: 1
  });

}

function update() {
    toybox.update();
}

function createButtons() {
  toybox.add.button({
    startingX: 0,
    color: "red",
    onPress: redButtonOnPress
  });

  toybox.add.button({
    startingX: 75,
    color: "green",
    onPress : greenButtonOnPress
  });

  toybox.add.button({
    startingX: 150,
    color: "blue",
    onPress: blueButtonOnPress
  });

  toybox.add.button({
    startingX: 225,
    color: "yellow",
    onPress: yellowButtonOnPress
  });
}
