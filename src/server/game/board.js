export class Board {
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

    clearRows() {
        let rowsCleared = 0;
        for (let row = this.rows - 1; row >= 0; row--) {
            if (!this.boardState[row].includes(this.background)) {
                this.boardState.splice(row, 1);
                this.boardState.unshift(
                    new Array(this.cols).fill(this.background)
                );
                rowsCleared++;
            }
        }
        return rowsCleared;
    }

    clearBottomRow() {
        this.boardState.splice(this.rows - 1, 1);
        this.boardState.unshift(new Array(this.cols).fill(this.background));
    }

    addGarbageRow(numGarbageRow) {
        // TODO: Check whether the game will end if garbage row is added.
        // This version will fail if the next block being placed is not considered
        // as gameover, even if the blocks placed should have exceeded.

        this.boardState.splice(0, numGarbageRow);

        const colIndexForHole = Math.floor(Math.random() * this.cols);
        let garbageRow = Array(10).fill("gray");
        garbageRow[colIndexForHole] = "white";

        for (let i = 0; i < numGarbageRow; i++) {
            this.boardState.push(garbageRow);
        }
    }

    getBoardState() {
        return this.boardState;
    }
}
