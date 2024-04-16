class Board {
  constructor(w, h) {
    this.foreground = [240];
    this.background = [170];

    this.cols = w;
    this.rows = h;
    this.boardState = Array(20).fill('#f43').map(() => Array(10).fill('#f43'));

    this.borderSize = 3;
    this.cellSize = 35;
    this.showGridlines = false;
  }

  show() {
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
        // TODO: Change the fill according to the color of the one in the grid
        fill(255);

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