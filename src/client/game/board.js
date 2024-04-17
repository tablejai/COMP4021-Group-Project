class Board {
    constructor(w, h) {
        this.foreground = [240];
        this.background = [170];

        this.cols = w;
        this.rows = h;
        this.boardState = Array(20)
            .fill(0)
            .map(() => Array(10).fill("white"));

        this.borderSize = BORDER_SIZE;
        this.cellSize = CELL_SIZE;

        this.opponentBoard = false;
    }

    draw() {
        // Draw the background
        stroke(this.background);
        strokeWeight(this.borderSize);

        // Draw the cells in between
        rectMode(CORNER);
        const topLeftX =
            floor(windowWidth / 2) -
            floor(
                (this.cellSize * this.boardState[0].length) / 2 +
                    this.borderSize
            );
        const topLeftY =
            floor(windowHeight / 2) -
            floor(
                (this.cellSize * this.boardState.length) / 2 + this.borderSize
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
