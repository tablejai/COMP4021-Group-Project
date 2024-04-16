const { COLOR_CODES } = require("constants");

YELLOW = COLOR_CODES[YELLOW];
CYAN = COLOR_CODES[CYAN];
PURPLE = COLOR_CODES[PURPLE];
GREEN = COLOR_CODES[GREEN];
RED = COLOR_CODES[RED];
BLUE = COLOR_CODES[BLUE];
ORANGE = COLOR_CODES[ORANGE];

class Block {
  static blockTypes = {
    O: [
      [YELLOW, YELLOW],
      [YELLOW, YELLOW],
    ],
    I: [
      [null, null, null, null],
      [CYAN, CYAN, CYAN, CYAN],
      [null, null, null, null],
      [null, null, null, null],
    ],
    S: [
      [null, GREEN, GREEN],
      [GREEN, GREEN, null],
      [null, null, null],
    ],
    Z: [
      [RED, RED, null],
      [null, RED, RED],
      [null, null, null],
    ],
    L: [
      [null, ORANGE, null],
      [null, ORANGE, null],
      [null, ORANGE, ORANGE],
    ],
    J: [
      [null, BLUE, null],
      [null, BLUE, null],
      [BLUE, BLUE, null],
    ],
    T: [
      [null, PURPLE, null],
      [PURPLE, PURPLE, PURPLE],
      [null, null, null],
    ],
  };

  constructor(blockType, x, y) {
    this.blockType = blockType;
    this.blockShape = this.blockTypes[this.blockType];
    this.x = x;
    this.y = y;
  }
};

module.exports{ 
    Block
};
