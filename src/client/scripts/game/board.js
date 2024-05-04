export class Board {
    constructor(canvasId, gridSize) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.ctx.font = "48px serif";
        this.gridSize = gridSize;
        this.rows = 20;
        this.cols = 10;
        this.boardState = Array(20)
            .fill(0)
            .map(() => Array(10).fill("white"));
        this.isGameOver = false;
    }

    draw() {
        this.ctx.strokeStyle = "#888";
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const x = col * this.gridSize;
                const y = row * this.gridSize;
                this.ctx.fillStyle = this.boardState[row][col];
                this.ctx.fillRect(x, y, this.gridSize, this.gridSize);
                this.ctx.strokeRect(x, y, this.gridSize, this.gridSize);
            }
        }

        if (this.isGameOver) {
            this.drawGameOver();
        }
    }

    drawGameOver() {
        this.ctx.fillStyle = "black";
        this.ctx.fillText("Game Over", 40, 300);
    }
}
