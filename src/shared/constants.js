export const PORT = 9000;
export const ROOM_SIZE = 2;

export const FRAME_RATE = 20;
export const THREE_MINUTES = 3 * 60 * 1000;

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const BORDER_SIZE = 1;
export const CELL_SIZE = 30;

export const OPPONENT_BOARD_BORDER_SIZE = 1;
export const OPPONENT_BOARD_CELL_SIZE = 12;

export const COLOR_CODES = {
    CYAN: [0, 255, 255],
    YELLOW: [255, 255, 0],
    PURPLE: [128, 0, 128],
    GREEN: [0, 255, 0],
    RED: [255, 0, 0],
    BLUE: [0, 0, 255],
    ORANGE: [255, 127, 0],
    GREY: [127, 127, 127],
};

export const YELLOW = COLOR_CODES["YELLOW"];
export const CYAN = COLOR_CODES["CYAN"];
export const PURPLE = COLOR_CODES["PURPLE"];
export const GREEN = COLOR_CODES["GREEN"];
export const RED = COLOR_CODES["RED"];
export const BLUE = COLOR_CODES["BLUE"];
export const ORANGE = COLOR_CODES["ORANGE"];

export const BLOCK_NAMES = ["O", "I", "S", "Z", "L", "J", "T"];

export const BLOCK_SHAPES = {
    O: [
        ["yellow", "yellow"],
        ["yellow", "yellow"],
    ],
    I: [
        [null, null, null, null],
        ["cyan", "cyan", "cyan", "cyan"],
        [null, null, null, null],
        [null, null, null, null],
    ],
    S: [
        [null, "green", "green"],
        ["green", "green", null],
        [null, null, null],
    ],
    Z: [
        ["red", "red", null],
        [null, "red", "red"],
        [null, null, null],
    ],
    L: [
        [null, "orange", null],
        [null, "orange", null],
        [null, "orange", "orange"],
    ],
    J: [
        [null, "blue", null],
        [null, "blue", null],
        ["blue", "blue", null],
    ],
    T: [
        [null, "purple", null],
        ["purple", "purple", "purple"],
        [null, null, null],
    ],
};

// // A hacky way of letting the frontend use the backend constants
// if (this && typeof module == "object" && module.exports && this === module.exports) {
//   module.exports = {
//     FRAME_RATE,
//     COLOR_CODES,
//     BLOCK_SHAPES,
//     BLOCK_NAMES,
//     BOARD_HEIGHT,
//     BOARD_WIDTH,
//   };
// }
