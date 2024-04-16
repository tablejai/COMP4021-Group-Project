class Board {
    constructor(w, h) {
        this.cols = w;
        this.rows = h;
        this.background = "white";
        this.boardState = Array(this.rows)
            .fill(0)
            .map(() => Array(this.cols).fill(this.background));
    }

    addBlockToBoard(block) {
        for (let row = 0; row < block.blockShape.length; row++) {
            for (let col = 0; col < block.blockShape[row].length; col++) {
                if (block.blockShape[row][col] != null) {
                    this.boardState[block.y + row][block.x + col] =
                        block.blockShape[row][col];
                }
            }
        }
    }

    canAdd(block) {
        for (let row = 0; row < block.blockShape.length; row++) {
            for (let col = 0; col < block.blockShape.length; col++) {
                if (block.blockShape[row][col] != null) {
                    let currentY = block.y + row;
                    let currentX = block.x + col;

                    if (
                        currentY < 0 ||
                        currentY >= this.rows ||
                        currentX < 0 ||
                        currentX >= this.cols ||
                        this.boardState[currentY][currentX] != this.background
                    ) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    getBoardState() {
        return this.boardState;
    }
}

module.exports = {
    Board,
};
