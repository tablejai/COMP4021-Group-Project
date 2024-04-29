import {
  OPPONENT_BOARD_BORDER_SIZE,
  OPPONENT_BOARD_CELL_SIZE,
  BOARD_WIDTH,
  BOARD_HEIGHT,
} from "../../constants.js";

export const BOARD_PLACEMENT = (function () {
  const PLACEMENT = {
    LEFT_UPPER_LEFT: null,
    LEFT_UPPER_RIGHT: null,
    LEFT_BOTTOM_LEFT: null,
    LEFT_BOTTOM_RIGHT: null,
    RIGHT_UPPER_LEFT: null,
    RIGHT_UPPER_RIGHT: null,
    RIGHT_BOTTOM_LEFT: null,
    RIGHT_BOTTOM_RIGHT: null,
    MAIN: null,
  };

  const PLACEMENT_INDEX = {
    0: "LEFT_UPPER_LEFT",
    1: "LEFT_UPPER_RIGHT",
    2: "LEFT_BOTTOM_LEFT",
    3: "LEFT_BOTTOM_RIGHT",
    4: "RIGHT_UPPER_LEFT",
    5: "RIGHT_UPPER_RIGHT",
    6: "RIGHT_BOTTOM_LEFT",
    7: "RIGHT_BOTTOM_RIGHT",
    100: "MAIN",
  };

  return {
    getPlacementFromIndex: function (index) {
      return PLACEMENT_INDEX[index];
    },

    get: function (placement) {
      return PLACEMENT[placement];
    },

    set: function (placement, value) {
      PLACEMENT[placement] = value;
    },

    autoCompute: function (p) {
      PLACEMENT["LEFT_UPPER_LEFT"] = {
        topLeftX:
          p.floor(p.width / 10) -
          p.floor((OPPONENT_BOARD_CELL_SIZE * BOARD_WIDTH) / 2 + OPPONENT_BOARD_BORDER_SIZE),
        topLeftY:
          p.floor(p.height / 4) -
          p.floor((OPPONENT_BOARD_CELL_SIZE * BOARD_HEIGHT) / 2 + OPPONENT_BOARD_BORDER_SIZE),
      };
      PLACEMENT["LEFT_UPPER_RIGHT"] = {
        topLeftX:
          p.floor((p.width * 3) / 10) -
          p.floor((OPPONENT_BOARD_CELL_SIZE * BOARD_WIDTH) / 2 + OPPONENT_BOARD_BORDER_SIZE),
        topLeftY:
          p.floor(p.height / 4) -
          p.floor((OPPONENT_BOARD_CELL_SIZE * BOARD_HEIGHT) / 2 + OPPONENT_BOARD_BORDER_SIZE),
      };
      PLACEMENT["LEFT_BOTTOM_LEFT"] = {
        topLeftX:
          p.floor(p.width / 10) -
          p.floor((OPPONENT_BOARD_CELL_SIZE * BOARD_WIDTH) / 2 + OPPONENT_BOARD_BORDER_SIZE),
        topLeftY:
          p.floor((p.height * 3) / 4) -
          p.floor((OPPONENT_BOARD_CELL_SIZE * BOARD_HEIGHT) / 2 + OPPONENT_BOARD_BORDER_SIZE),
      };
      PLACEMENT["LEFT_BOTTOM_RIGHT"] = {
        topLeftX:
          p.floor((p.width * 3) / 10) -
          p.floor((OPPONENT_BOARD_CELL_SIZE * BOARD_WIDTH) / 2 + OPPONENT_BOARD_BORDER_SIZE),
        topLeftY:
          p.floor((p.height * 3) / 4) -
          p.floor((OPPONENT_BOARD_CELL_SIZE * BOARD_HEIGHT) / 2 + OPPONENT_BOARD_BORDER_SIZE),
      };
      PLACEMENT["RIGHT_UPPER_LEFT"] = {
        topLeftX:
          p.floor((p.width * 6) / 10) +
          p.floor((OPPONENT_BOARD_CELL_SIZE * BOARD_WIDTH) / 2 + OPPONENT_BOARD_BORDER_SIZE),
        topLeftY:
          p.floor(p.height / 4) -
          p.floor((OPPONENT_BOARD_CELL_SIZE * BOARD_HEIGHT) / 2 + OPPONENT_BOARD_BORDER_SIZE),
      };
      PLACEMENT["RIGHT_UPPER_RIGHT"] = {
        topLeftX:
          p.floor((p.width * 8) / 10) +
          p.floor((OPPONENT_BOARD_CELL_SIZE * BOARD_WIDTH) / 2 + OPPONENT_BOARD_BORDER_SIZE),
        topLeftY:
          p.floor(p.height / 4) -
          p.floor((OPPONENT_BOARD_CELL_SIZE * BOARD_HEIGHT) / 2 + OPPONENT_BOARD_BORDER_SIZE),
      };
      PLACEMENT["RIGHT_BOTTOM_LEFT"] = {
        topLeftX:
          p.floor((p.width * 6) / 10) +
          p.floor((OPPONENT_BOARD_CELL_SIZE * BOARD_WIDTH) / 2 + OPPONENT_BOARD_BORDER_SIZE),
        topLeftY:
          p.floor((p.height * 3) / 4) -
          p.floor((OPPONENT_BOARD_CELL_SIZE * BOARD_HEIGHT) / 2 + OPPONENT_BOARD_BORDER_SIZE),
      };
      PLACEMENT["RIGHT_BOTTOM_RIGHT"] = {
        topLeftX:
          p.floor((p.width * 8) / 10) +
          p.floor((OPPONENT_BOARD_CELL_SIZE * BOARD_WIDTH) / 2 + OPPONENT_BOARD_BORDER_SIZE),
        topLeftY:
          p.floor((p.height * 3) / 4) -
          p.floor((OPPONENT_BOARD_CELL_SIZE * BOARD_HEIGHT) / 2 + OPPONENT_BOARD_BORDER_SIZE),
      };
    },
  };
})();
