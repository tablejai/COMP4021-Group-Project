function setup() {
    board = new Board(BOARD_WIDTH, BOARD_HEIGHT);
    currentBlock = new Block("Z", 100, 100);

    let canvasWidth = board.cellSize * BOARD_WIDTH + board.borderSize * 2;
    let canvasHeight = board.cellSize * BOARD_HEIGHT + board.borderSize * 2;

    createCanvas(windowWidth, windowHeight);
}

function draw() {
    board.draw();
    currentBlock.draw();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
