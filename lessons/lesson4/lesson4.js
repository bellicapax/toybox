var blockColumns = [1, 2, 3, 5, 6, 7, 10];

var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var toybox;
var settings = {
    gravity: 980
};
var blocksTimerEvent;

function preload() {
    toybox = new Toybox(game, settings);
    toybox.preload();
}

function create() {
    var timer = new Phaser.Timer(game, true);
    var delay = 500;
    addRowOfBlocks();
    toybox.add.alienPlayer({
        speed: 100,
        jumpForce: 350
    });
    toybox.add.coin({
        startingX: game.world.width * 0.85,
        startingY: game.world.height * 0.6,
        allowGravity: false
    });
    // blocksTimerEvent = game.time.events.loop(delay, addRowOfBlocks, this);
}

function addRowOfBlocks() {
    var allColumnsEmpty = true;
    for (var i = 0; i < blockColumns.length; i++) {
        for (var j = 0; j < blockColumns[i]; j++) {
            var isEven = i % 2 == 0;
            if (blockColumns[i] > 0) {
                allColumnsEmpty = false;
                toybox.add.crate({
                    scale: 1,
                    allowGravity: false,
                    immovable: true,
                    startingX: (game.world.width / blockColumns.length) * i + (game.world.width / blockColumns.length) * 0.5,
                    startingY: game.world.height - (8 + j * 16)
                });
                // blockColumns[i]--;
            }

        }
    }
    // if (allColumnsEmpty) {
    //     console.log("timer is done!")
    //     game.time.events.remove(blocksTimerEvent);
    // }
}

function update() {
    toybox.update();
}
