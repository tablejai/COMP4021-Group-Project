function setup() { 
    board = new Board(BOARD_WIDTH, BOARD_HEIGHT);

    let canvasWidth = board.cellSize * BOARD_WIDTH + board.borderSize * 2;
    let canvasHeight = board.cellSize * BOARD_HEIGHT + board.borderSize * 2;

    createCanvas(canvasWidth, canvasHeight);
}

function draw() { 
    board.show();
}