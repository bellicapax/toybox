var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;
var settings = {
    gravity: 980,
    plugins: ["crate","coin","mushroom","alien","backdrop","gem","slime","platform","spring","button","fly","lever","fireball","jelly","lava","spikes"]
};

function preload() {
    toybox = new Toybox(game,settings);
    toybox.preload();
}

function create() {
    toybox.create();

    backdrop = toybox.add.backdrop({ preset: "summer" });

    //spring = toybox.add.spring({ startingX: 200});

    // button = toybox.add.button({ 
    //     startingX: 200,
    //     onPress: function(){
    //         for (var i = 0; i < 8; i++) {
    //             toybox.add.slime({startingX: toybox.diceRoll(641)-1})
    //         }
    //     }
    // });

    // lever = toybox.add.lever({ 
    //     startingX: 320,
    //     startingY: 480 - 24,
    //     whileLeft: function(){
    //         if(toybox.oneOutOf(300)){ 
    //             toybox.add.coin({startingX: 100, startingY: 100, dX: (Phaser.Math.between(50,200)), dy: -200});
    //         };
            
    //     },
    //     whileRight: function(){
    //         if(toybox.oneOutOf(300)){ 
    //             toybox.add.coin({startingX: 540, startingY: 100, dX: (Phaser.Math.between(-50,-200)), dy: -200});
    //         };
    //     }
    // });

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
        jump: 87,
    }
    playerOptions.facing = "right";

    crates = new Phaser.Group(game, null, 'crates', true);

    player2 = toybox.add.alien(playerOptions);

    //gem = toybox.add.gem({color: "red"});

    // slime = toybox.add.slime({ startingX: 200});
    // slime = toybox.add.slime({ startingX: 200, facing: "right"});

    fly = toybox.add.fly({ startingX: 400, color: "black"});
    fly = toybox.add.fly({ startingX: 450, facing: "right"});

    //fireball = toybox.add.fireball({ startingX: 500, startingY: 100});
    //fireball2 = toybox.add.fireball({ startingX: 550, startingY: 100, facing: "right"});

    //jelly = toybox.add.jelly({ startingX: 600});

    //lava = toybox.add.lava({startingX: 64, startingY: 480 - 24 });

    spikes = toybox.add.spikes({startingX: 200, startingY: 440 });



}

function update() {
    toybox.update();

    if(toybox.oneOutOf(100)){ 
        // var newCrate = toybox.add.crate({startingX: toybox.diceRoll(641)-1})
        // crates.add(newCrate);
    };

    if(toybox.oneOutOf(30)){ 
        // toybox.add.coin({startingX: 320, startingY: 100, dX: (toybox.diceRoll(400) - 200), dy: -200});
    };

    if(toybox.oneOutOf(400)){ 
        // toybox.add.mushroom({startingX: toybox.diceRoll(641)-1})
    };

    if(toybox.oneOutOf(400)){ 
        // toybox.add.slime({startingX: toybox.diceRoll(641)-1})
    };

    if(toybox.oneOutOf(400)){ 
        // toybox.add.gem({startingX: toybox.diceRoll(641)-1, startingY: 300})
    };

    if(crates.children.length > 20){
        var remover = crates.children.shift();
        remover.kill();
    };
}
