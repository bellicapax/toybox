var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;
var settings = {
    gravity: 980,
    plugins: ["crate","coin","mushroom","alien","backdrop","gem","slime","platform","spring"]
};

function preload() {
    toybox = new Toybox(game,settings);
    toybox.preload();
}

function create() {
    toybox.create();

    backdrop = toybox.add.backdrop({ preset: "summer" });

    spring = toybox.add.spring({
        startingX: 200
    });

    floor = toybox.add.platform({
        width: game.width,
        height: 16,
        startingX: game.width / 2,
        startingY: game.height - 8,
        type: 4
    });

    function oopsFloor(floor, collidedSprite){
        if( collidedSprite.y > floor.y - (floor.height / 2) ){
            collidedSprite.y = floor.y - (floor.height / 2) - (collidedSprite.height / 2)
        }
    };

    floor.body.onCollide.add(oopsFloor);

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

    crates = new Phaser.Group(game, null, 'crates', true);

    //player2 = toybox.add.alien(playerOptions);

    // gem = toybox.add.gem({color: "red"});

    //slime = toybox.add.slime({ startingX: 200});


}

function update() {
    toybox.update();

    if(toybox.oneOutOf(100)){ 
        var newCrate = toybox.add.crate({startingX: toybox.diceRoll(641)-1})
        crates.add(newCrate);
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

    if(toybox.oneOutOf(400)){ 
        toybox.add.gem({startingX: toybox.diceRoll(641)-1, startingY: 300})
    };

    if(crates.children.length > 20){
        var remover = crates.children.shift();
        remover.kill();
    };
}
