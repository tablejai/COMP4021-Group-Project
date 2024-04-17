class Block {
    constructor(blockType, blockShape, x, y) {
        this.blockType = blockType;
        this.blockShape = blockShape;

        this.x = x;
        this.y = y;
    }

    draw() {
        for (let row = 0; row < this.blockShape.length; row++) {
            for (let col = 0; col < this.blockShape.length; col++) {
                if (this.blockShape[row][col] != null) {
                    let x = this.x + col;
                    let y = this.y + row;

                    fill(this.blockShape[row][col]);

                    rect(
                        BORDER_SIZE + CELL_SIZE * x,
                        BORDER_SIZE + CELL_SIZE * y,
                        CELL_SIZE - 1,
                        CELL_SIZE - 1
                    );
                }
            }
        }
    }
}
