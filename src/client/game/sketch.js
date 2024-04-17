function setup() {
    board = new Board(BOARD_WIDTH, BOARD_HEIGHT, false, "MAIN");
    currentBlock = new Block("Z", 100, 100);

    createCanvas(windowWidth, windowHeight);
    BOARD_PLACEMENT.autoCompute();
}

var opponentBoards = {};
function draw() {
    board.draw();
    for (var opponentBoard in opponentBoards) {
        opponentBoards[opponentBoard].draw();
    }
    currentBlock.draw();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    BOARD_PLACEMENT.autoCompute();
}
