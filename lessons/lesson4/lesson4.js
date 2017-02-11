var blockColumns = [1, 2, 3];

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
    var timer = new Phaser.Timer(game, true);
    var delay = 200;
    timer.loop(delay, addRowOfBlocks, this);
    timer.start();
}

function addRowOfBlocks() {
    var allColumnsEmpty = true;
    for (var i = 0; i < blockColumns.length; i++) {
        if (blockColumns[i] > 0) {
            allColumnsEmpty = false;
            game.add.crate({
                startingX: (game.world.width / blockColumns.length) * i
            });
            blockColumns[i]--;
        }
    }
    if (allColumnsEmpty) {
        console.log("timer is done!")
        this.stop();
    }
}

function update() {
    toybox.update();
}
