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
    }

    getBlockInfo() {
        return { x: this.x, y: this.y, blockType: this.blockType };
    }
}

module.exports = { Block };
