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

    shouldFall(currentTicks) {
        return currentTicks - this.lastDropTicks > this.dropInterval;
    }

    fall() {
        this.y++;
    }

    rise() {
        this.y--;
    }

    resetLastDropTicks() {
        this.lastDropTicks = Date.now();
    }

    getBlockInfo() {
        return { x: this.x, y: this.y, blockType: this.blockType };
    }
}

module.exports = { Block };
