const {
    BLOCK_SHAPES,
    BLOCK_NAMES,
    BOARD_WIDTH,
} = require("../../shared/constants");

class Block {
    static getRandomBlockType() {
        return BLOCK_NAMES[Math.floor(Math.random() * BLOCK_NAMES.length)];
    }

    constructor(blockType) {
        this.blockType = blockType;
        this.blockShape = BLOCK_SHAPES[this.blockType];

        this.x = Math.floor((BOARD_WIDTH - this.blockShape.length) / 2);
        this.y = 0;

        this.lastDropTicks = Date.now();
        this.dropInterval = 500; // In milliseconds
    }

    resetLastDropTicks() {
        this.lastDropTicks = Date.now();
    }

    shouldFall(currentTicks) {
        return currentTicks - this.lastDropTicks > this.dropInterval;
    }

    fall() {
        this.y++;
    }

    rise() {
        this.y--;
    }

    moveLeft() {
        this.x--;
    }

    moveRight() {
        this.x++;
    }

    rotateClockwise() {
        let temp = [];

        for (let col = 0; col < this.blockShape.length; col++) {
            let tempRow = [];
            for (let row = this.blockShape.length - 1; row >= 0; row--) {
                tempRow.push(this.blockShape[row][col]);
            }
            temp.push(tempRow);
        }
        this.blockShape = temp;
    }

    rotateAntiClockwise() {
        let temp = [];

        for (let col = this.blockShape.length - 1; col >= 0; col--) {
            let tempRow = [];
            for (let row = 0; row < this.blockShape.length; row++) {
                tempRow.push(this.blockShape[row][col]);
            }
            temp.push(tempRow);
        }
        this.blockShape = temp;
    }

    getBlockInfo() {
        return {
            x: this.x,
            y: this.y,
            blockType: this.blockType,
            blockShape: this.blockShape,
        };
    }
}

module.exports = { Block };
