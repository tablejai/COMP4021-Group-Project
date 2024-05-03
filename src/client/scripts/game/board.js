const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");
const gridSize = 30;
const rows = 20;
const cols = 10;

class Board {
    constructor(boardPlacement) {
        this.boardState = Array(20)
            .fill(0)
            .map(() => Array(10).fill("white"));
    }

    draw() {
        ctx.strokeStyle = "black";
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * gridSize;
                const y = row * gridSize;
                ctx.fillStyle = this.boardState[row][col];
                ctx.fillRect(x, y, gridSize, gridSize);
                ctx.strokeRect(x, y, gridSize, gridSize);
            }
        }
    }
}

export { Board };
