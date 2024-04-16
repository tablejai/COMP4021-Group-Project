const FRAME_RATE = 10;
const COLOR_CODES = {
  CYAN: [0, 255, 255],
  YELLOW: [255, 255, 0],
  PURPLE: [128, 0, 128],
  GREEN: [0, 255, 0],
  RED: [255, 0, 0],
  BLUE: [0, 0, 255],
  ORANGE: [255, 127, 0],
  GREY: [127, 127, 127],
};

const YELLOW = COLOR_CODES["YELLOW"];
const CYAN = COLOR_CODES["CYAN"];
const PURPLE = COLOR_CODES["PURPLE"];
const GREEN = COLOR_CODES["GREEN"];
const RED = COLOR_CODES["RED"];
const BLUE = COLOR_CODES["BLUE"];
const ORANGE = COLOR_CODES["ORANGE"];

const BLOCK_NAMES = ["O", "I", "S", "Z", "L", "J", "T"];

const BLOCK_SHAPES = {
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

module.exports = {
  FRAME_RATE,
  COLOR_CODES,
  BLOCK_SHAPES,
  BLOCK_NAMES,
};
