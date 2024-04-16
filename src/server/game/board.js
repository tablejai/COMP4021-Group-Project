class Board {
    constructor(w, h) {
        this.cols = w;
        this.rows = h;
        this.boardState = Array(20)
            .fill(0)
            .map(() => Array(10).fill("white"));
    }

    addBlockToBoard(block) {
        for (let row = 0; row < block.blockShape.length; row++) {
            for (let col = 0; col < block.blockShape[row].length; col++) {
                this.boardState[block.x + col][block.y + row] =
                    block.blockShape[row][col];
            }
        }
    }
}
