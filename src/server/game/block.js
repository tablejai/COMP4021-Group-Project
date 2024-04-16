const { BLOCK_SHAPES, BLOCK_NAMES } = require("../constants");

class Block {
    static spawnRandom() {
        return random(BLOCK_NAMES);
    }

    constructor(blockType, x, y) {
        this.blockType = blockType;
        this.blockShape = BLOCK_SHAPES[this.blockType];

        this.x = x;
        this.y = y;
    }
}

module.exports = { Block };
