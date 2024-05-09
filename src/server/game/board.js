export class Board {
    constructor(w, h) {
        this.cols = w;
        this.rows = h;
        this.background = "white";
        this.garbageColor = "gray";
        this.boardState = Array(this.rows)
            .fill(0)
            .map(() => Array(this.cols).fill(this.background));
    }

    addBlockToBoard(block) {
        for (let row = 0; row < block.blockShape.length; row++) {
            for (let col = 0; col < block.blockShape[row].length; col++) {
                if (block.blockShape[row][col] == null) continue;
                this.boardState[block.y + row][block.x + col] = block.blockShape[row][col];
            }
        }
    }

    addPartialBlockToBoard(block) {
        let y = block.y,
            x = block.x;
        // add block to the board bottom up
        for (let row = block.blockShape.length - 1; row >= 0; row--) {
            for (let col = 0; col < block.blockShape[row].length; col++) {
                if (block.blockShape[row][col] == null) continue;
                const currentY = y + row;
                const currentX = x + col;

                if (currentY < 0 || currentX < 0) continue;

                // this row is occupied
                if (
                    this.boardState[currentY][currentX] != this.background ||
                    this.boardState[currentY][currentX + 1] != this.background
                ) {
                    y--;
                    row++;
                    break;
                }
                this.boardState[currentY][currentX] = block.blockShape[row][col];
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
                this.boardState.unshift(new Array(this.cols).fill(this.background));
                const isGarbageRow = this.boardState[row].includes(this.garbageColor);
                if (!isGarbageRow) {
                    rowsCleared++;
                }
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

        var isGameOver = false;

        const colIndexForHole = Math.floor(Math.random() * this.cols);
        let garbageRow = Array(10).fill(this.garbageColor);
        garbageRow[colIndexForHole] = this.background;

        for (let i = 0; i < numGarbageRow; i++) {
            this.boardState.push(garbageRow);
        }

        for (let row = 0; row < numGarbageRow; row++) {
            if (!this.boardState[row].includes(this.background)) {
                isGameOver = true;
            }
        }

        this.boardState.splice(0, numGarbageRow);

        return isGameOver;
    }

    getBoardState() {
        return this.boardState;
    }
}
