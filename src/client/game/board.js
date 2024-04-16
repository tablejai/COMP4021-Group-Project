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
        this.showGridlines = false;
    }

    draw() {
        // Draw the background
        if (this.showGridlines) fill(this.foreground);
        else fill(this.background);

        stroke(this.background);
        strokeWeight(this.borderSize);

        let offset = floor(this.borderSize / 2);
        rect(
            offset,
            offset,
            this.cellSize * this.cols + this.borderSize - 1,
            this.cellSize * this.rows + this.borderSize - 1
        );

        // Draw the cells in between
        for (let row = 0; row < this.boardState.length; row++) {
            for (let col = 0; col < this.boardState[row].length; col++) {
                fill(this.boardState[row][col]);

                rect(
                    this.cellSize * col + this.borderSize,
                    this.cellSize * row + this.borderSize,
                    this.cellSize - 1,
                    this.cellSize - 1
                );
            }
        }
    }
}
