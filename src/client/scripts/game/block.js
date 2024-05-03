class Block {
    constructor(blockType, blockShape, x, y) {
        this.blockType = blockType;
        this.blockShape = blockShape;

        this.x = x;
        this.y = y;
    }

    draw() {
        console.log("drawing block");
        const canvas = document.getElementById("grid");
        const ctx = canvas.getContext("2d");

        const BORDER_SIZE = 1;
        const CELL_SIZE = 30;
        const BOARD_WIDTH = 10;
        const BOARD_HEIGHT = 20;

        ctx.lineWidth = BORDER_SIZE;
        const topLeftX =
            Math.floor(ctx.canvas.width / 2) -
            Math.floor((CELL_SIZE * BOARD_WIDTH) / 2 + BORDER_SIZE);
        const topLeftY =
            Math.floor(ctx.canvas.height / 2) -
            Math.floor((CELL_SIZE * BOARD_HEIGHT) / 2 + BORDER_SIZE);

        for (let row = 0; row < this.blockShape.length; row++) {
            for (let col = 0; col < this.blockShape[row].length; col++) {
                if (this.blockShape[row][col] != null) {
                    let x = this.x + col;
                    let y = this.y + row;

                    ctx.fillStyle = this.blockShape[row][col];

                    ctx.fillRect(
                        topLeftX + BORDER_SIZE + CELL_SIZE * x,
                        topLeftY + BORDER_SIZE + CELL_SIZE * y,
                        CELL_SIZE - 1,
                        CELL_SIZE - 1
                    );
                }
            }
        }
    }
}

// Example usage:
// const canvas = document.getElementById("grid");
// const ctx = canvas.getContext("2d");

// const block = new Block("type", BLOCK_SHAPES["O"], 0, 0);
// block.draw(ctx);

export { Block };
