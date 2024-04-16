let board;

function setup() { 
    board = new Board(BOARD_WIDTH, BOARD_HEIGHT);

    let totalWidth = board.cellSize * BOARD_WIDTH + board.borderSize * 2;
    let totalHeight = board.cellSize * BOARD_HEIGHT + board.borderSize * 2;

    createCanvas(totalWidth, totalHeight);
}

function draw() { 
    board.show();
}