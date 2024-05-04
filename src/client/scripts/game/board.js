export class Board {
    constructor(canvasId, gridSize) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.ctx.font = "bold 48px Geologica, serif";
        this.gridSize = gridSize;
        this.rows = 20;
        this.cols = 10;
        this.boardState = Array(20)
            .fill(0)
            .map(() => Array(10).fill("white"));
        this.isGameOver = false;
    }

    updateBoard(board) {
        this.boardState = board;
    }

    draw() {
        if (this.isGameOver) {
            this.drawGameOver();
            return;
        }
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
    }

    drawGameOver() {
        if (this.canvas.id === "grid") {
            this.drawTextBG("Game Over", 25, 300);
        } else {
            this.canvas.style.filter = "brightness(0.5)";
        }
    }

    clear() {
        this.canvas.style.filter = "";
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawTextBG(txt, x, y) {
        /// lets save current state as we make a lot of changes
        this.ctx.save();

        /// draw text from top - makes life easier at the moment
        this.ctx.textBaseline = "top";

        /// color for background
        this.ctx.fillStyle = "#f00";

        /// get width of text
        var width = this.ctx.measureText(txt).width;

        /// draw background rect assuming height of font
        this.ctx.fillRect(x, y, width, parseInt(this.ctx.font, 10));

        /// text color
        this.ctx.fillStyle = "#000";

        /// draw text on top
        this.ctx.fillText(txt, x, y);

        /// restore original state
        this.ctx.restore();
    }
}
