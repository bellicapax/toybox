var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;
var settings = {
    gravity: 980,
    plugins: ["crate","coin","mushroom","alien","backdrop","gem","slime"]
};

function preload() {
    toybox = new Toybox(game,settings);
    toybox.preload();
}

function create() {

    backdrop = toybox.add.backdrop({ preset: "summer" });

    var playerOptions = {
        startingX : 100,
        startingY: 100,
        color: "pink",
        jumpForce: 300,
        speed: 100,
        scale: 1
    }

    player1 = toybox.add.alien(playerOptions);
    //player1.health = 1;

    playerOptions.color = "blue";
    playerOptions.startingX = 300;
    playerOptions.controls = {
        left:65,
        right:68,
        jump: 87
    }

    //player2 = toybox.add.alien(playerOptions);

    // gem = toybox.add.gem({color: "red"});

    //slime = toybox.add.slime({ startingX: 200});


}

function update() {
    toybox.update();

    for (var i = toybox.collectibles.children.length - 1; i >= 0; i--) {
        if (typeof(toybox.collectibles.children[i].age) == "undefined"){
            toybox.collectibles.children[i].age = 0;
        } else {
            toybox.collectibles.children[i].age++;
            if (toybox.collectibles.children[i].age >= 300){
                //toybox.collectibles.children[i].kill();
            }
        }
    }

    if(toybox.oneOutOf(100)){ 
        toybox.add.crate({startingX: toybox.diceRoll(641)-1})
    };

    if(toybox.oneOutOf(30)){ 
        toybox.add.coin({startingX: 320, startingY: 100, dX: (toybox.diceRoll(400) - 200), dy: -200});
    };

    if(toybox.oneOutOf(400)){ 
        toybox.add.mushroom({startingX: toybox.diceRoll(641)-1})
    };

    if(toybox.oneOutOf(400)){ 
        toybox.add.slime({startingX: toybox.diceRoll(641)-1})
    };

    if(toybox.blocks.children.length > 30){
        toybox.blocks.children[0].kill();
    };
}
