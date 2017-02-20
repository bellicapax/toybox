// HOORAY FOR ARRAYS
// In this lesson, our little alien friend is far away from a coin they want
// We are going to use Arrays to help them get there!
// Arrays are a way of holding a bunch of data inside a single variable
// The way the data is held is that it is ordered numerically


// -------ONE-------
// --Declaring an array--
// To make an array, you declare a variable and assign it to a set of square brackets: []
var blockColumns = [];
var blockColumnsWithSize = [];
var coinPositions = [];
// Right now, there's nothing in the array. We call an array in this state "empty"
// You can add data either when you assign the array OR anytime afterwards
// We'll look at that next, but for now, go ahead and run index.html to see what happens with an empty array

// -------TWO-------
// --Assigning data in declaration--
// Now let's put some data in our array!
// For this first example, we want to tell the code below how many crates we want stacked
// And we want to tell them how many columns of stacked crates we want
// To add these numbers when we assign the array, we simply put them in the brackets
// AND WE MAKE SURE TO SEPARATE THEM WITH COMMAS! (or our code will break!)
// Try looking at the array below and imagining what some crates stacked at the bottom of the screen
// might look like if they were using this data to understand how many to spawn
// Go ahead and uncomment the next line and refresh the page!
// blockColumns = [2, 1, 3];

// -------THREE-------
// Did you figure out what the numbers mean for how many columns and how many crates?
// Uncomment the line below and try changing what the numbers are in the array, but don't change how many elements there are yet
// blockColumns = [2, 1, 3];

// -------FOUR-------
// Now try changing how many numbers are in the array
// Remember, each number except the last must be followed by a comma!
// Uncomment the next line and try putting in more numbers!
// blockColumns = [2, 1, 3];


// -------FIVE-------
// --Assigning at an index--
// What if we like all the numbers in our array except ONE?
// How do we tell one number in the array to be different?
// We need to reassign that element:
// We call each piece of data in an array an "element"
// The number at which each element lives is called an index
// So an element "lives" at an index.
// And you use an index (a number) to get an element
// Arrays in most programming languages (including Javascript) are "zero-based"
// Zero-based means that the first element always lives at "0"
// In code, the syntax for getting the first element looks like this:
var theFirstElement = blockColumns[0];
// Assigning to an element is just as easy!
// We just make sure the equals sign is on the other side
// Uncomment the next line and refresh the page
// blockColumns[0] = 5;

// -------SIX-------
// --Push--
// We just saw how we change an element after we have assigned the array.
// But what if we want to add an element after we assign the array?
// Javascript gives many handy functions to do this and we'll look at two:
// push() places a new element at the END of the array
// The array is ordered from left to right in the assignment
// So the new element will come LAST (and have the highest index of any element in the array)
// Uncomment the next line and put a number in the parenthesis. Then refresh the page!
// blockColumns.push();

// -------SEVEN-------
// --Unshift--
// push() is great if we want to add an element at the END
// But what if we want to add one at the beginning?
// unshift() lets us add an element at the beginning
// It's a funny name, but we'll see why it's named that later
// Uncomment the next line and put a number in the parenthesis. Then refresh the page!
// blockColumns.unshift();

// -------EIGHT-------
// --Pop--
// Sometimes we will want to remove the last element in an array
// For that, we want to use the fucntion pop()
// Pop removes the last element from the array and returns it for us
// Uncomment the next two lines and refresh!
// var lastElement = blockColumns.pop();
// alert("The last element in the array was " + lastElement);

// -------NINE-------
// --Shift--
// Remember UNwhoft? Well, it's the opposite of shift()
// Like pop(), shift() removes and returns an element
// But this time, it removes an element from the beginning
// Comment out the two lines from the last section
// Uncomment the next two lines and refresh!
// var lastElement = blockColumns.shift();
// alert("The last element in the array was " + lastElement);

// -------TEN-------
// --Array of arrays--
// The elements in an an array can be any kind of data stored in a variable - including other arrays!
// Let's use this ability to hold a pair of numbers together in their own array
// The first number will be the number of blocks we create
// The second number will be the size of those blocks
// We assign an array holding other arrays like so:
// blockColumnsWithSize = [ [1, 4], [2, 2], [3, 1], [4, 3]];
// Uncomment the previous line and refresh to see what happens!


// -------CHALLENGE ONE-------
// --Get the Coins!--
// Using what you know about declaring, assigning, and editing arrays,
// modify ONLY the blockColumnsWithSize array to try and reach as many coins as you can!
// (HINT: There's a trick to getting them all once you figure out how to reach them!)
// Uncomment the next line and refresh to spawn the coins!
// coinPositions = [ [ 531, 109 ],  [ 480, 101 ],  [ 423, 86 ],  [ 367, 74 ],  [ 312, 64 ],  [ 251, 54 ],  [ 192, 46 ],  [ 133, 41 ], [ 393, 77 ],  [ 342, 68 ],  [ 284, 58 ],  [ 220, 46 ],  [ 162, 41 ]];

// -------CHALLENGE TWO-------
// --Make your own challenge!--
// Uncomment the line below
// coinPositions = [];
// After you refresh, while the game is running, click anywhere to spawn a coin
// Create some coins you want to challenge your classmates to reach
// When you like your pattern, press the p key to print your array to the console
// Use the mouse to select all the array it printed and copy it with CTRL+C
// Delete the "[];" in the declaration of coinPositions above
// Paste your new array in its place with CTRL+V
// Refresh and try to reach your coins!
// MAKE SURE YOU CAN REACH THEM JUST BY EDITING THE blockColumnsWithSize ARRAY!
// After you beat your own level, submit the array to the class slack channel!

// ---- END OF LESSON MATERIAL ---






var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;
var settings = {
    gravity: 980
};
var pKey;

function preload() {
    toybox = new Toybox(game, settings);
    toybox.preload();
}

function create() {
    var timer = new Phaser.Timer(game, true);
    var delay = 500;
    
    if (blockColumnsWithSize.length) {
        addColumnsOfBlocksWithScale(blockColumnsWithSize);
    } else {
        addColumnsOfBlocks(blockColumns);
    }
    
    toybox.add.alien({
        speed: 100,
        jumpForce: 400
    });
    for (var i = 0; i < coinPositions.length; i++) {
        toybox.add.coin({
            startingX: coinPositions[i][0],
            startingY: coinPositions[i][1],
            allowGravity: false
        });
    }
    game.input.onTap.add(createCoinForTap);
    pKey = game.input.keyboard.addKey(80);
}

function addColumnsOfBlocks(columnsArray) {
    for (var i = 0; i < columnsArray.length; i++) {
        for (var j = 0; j < columnsArray[i]; j++) {
            toybox.add.crate({
                scale: 1,
                allowGravity: false,
                immovable: true,
                startingX: (game.world.width / columnsArray.length) * i + (game.world.width / columnsArray.length) * 0.5,
                startingY: game.world.height - (8 + j * 16)
            });
        }
    }
}

function addColumnsOfBlocksWithScale(columnsArray) {
    for (var i = 0; i < columnsArray.length; i++) {
        for (var j = 0; j < columnsArray[i][0]; j++) {
            toybox.add.crate({
                scale: columnsArray[i][1],
                allowGravity: false,
                immovable: true,
                startingX: (game.world.width / columnsArray.length) * i + (game.world.width / columnsArray.length) * 0.5,
                startingY: game.world.height - (8 * columnsArray[i][1] + j * 16 * columnsArray[i][1])
            });
        }
    }
}

function update() {
    toybox.update();
    if (pKey.isDown) {
        var arrayString = "[";
        for (var i = 0; i < coinPositions.length; i++) {
            arrayString += " [ " + coinPositions[i][0] + ", " + coinPositions[i][1] + " ]";
            if(i < coinPositions.length - 1){
              arrayString += ", ";
            }
        }
        arrayString += "];";
        console.log(arrayString);
    }
}

function createCoinForTap(pointer) {
    toybox.add.coin({
        startingX: pointer.x,
        startingY: pointer.y,
        allowGravity: false
    });
    coinPositions.push([
        pointer.x,
        pointer.y
    ]);
}
