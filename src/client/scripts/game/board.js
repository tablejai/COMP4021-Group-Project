class Board {
    constructor(w, h, isOpponentBoard, placement) {
        this.foreground = [240];
        this.background = [170];

        this.cols = w;
        this.rows = h;
        this.boardState = Array(20)
            .fill(0)
            .map(() => Array(10).fill("white"));

        this.borderSize = BORDER_SIZE;
        this.cellSize = CELL_SIZE;
        this.placement = placement;

        this.opponentBoard = isOpponentBoard;
    }

    draw() {
        // Draw the background
        stroke(this.background);

        // Draw the cells in between
        rectMode(CORNER);
        if (this.opponentBoard) {
            strokeWeight(OPPONENT_BOARD_BORDER_SIZE);
            const placement = BOARD_PLACEMENT.get(this.placement);
            console.log(this.placement);
            const topLeftX = placement["topLeftX"];
            const topLeftY = placement["topLeftY"];

            for (let row = 0; row < this.boardState.length; row++) {
                for (let col = 0; col < this.boardState[row].length; col++) {
                    fill(this.boardState[row][col]);

                    rect(
                        topLeftX +
                            OPPONENT_BOARD_CELL_SIZE * col +
                            OPPONENT_BOARD_BORDER_SIZE,
                        topLeftY +
                            OPPONENT_BOARD_CELL_SIZE * row +
                            OPPONENT_BOARD_BORDER_SIZE,
                        OPPONENT_BOARD_CELL_SIZE - 1,
                        OPPONENT_BOARD_CELL_SIZE - 1
                    );
                }
            }
        } else {
            strokeWeight(BORDER_SIZE);
            const topLeftX =
                floor(windowWidth / 2) -
                floor(
                    (this.cellSize * this.boardState[0].length) / 2 +
                        this.borderSize
                );
            const topLeftY =
                floor(windowHeight / 2) -
                floor(
                    (this.cellSize * this.boardState.length) / 2 +
                        this.borderSize
                );

            for (let row = 0; row < this.boardState.length; row++) {
                for (let col = 0; col < this.boardState[row].length; col++) {
                    fill(this.boardState[row][col]);

                    rect(
                        topLeftX + this.cellSize * col + this.borderSize,
                        topLeftY + this.cellSize * row + this.borderSize,
                        this.cellSize - 1,
                        this.cellSize - 1
                    );
                }
            }
        }
    }
}
