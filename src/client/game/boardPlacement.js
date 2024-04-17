var BOARD_PLACEMENT = (function () {
    PLACEMENT = {
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

    PLACEMENT_INDEX = {
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

        autoCompute: function () {
            PLACEMENT["LEFT_UPPER_LEFT"] = {
                topLeftX:
                    floor(windowWidth / 10) -
                    floor(
                        (OPPONENT_BOARD_CELL_SIZE * BOARD_WIDTH) / 2 +
                            OPPONENT_BOARD_BORDER_SIZE
                    ),
                topLeftY:
                    floor(windowHeight / 4) -
                    floor(
                        (OPPONENT_BOARD_CELL_SIZE * BOARD_HEIGHT) / 2 +
                            OPPONENT_BOARD_BORDER_SIZE
                    ),
            };
            PLACEMENT["LEFT_UPPER_RIGHT"] = {
                topLeftX:
                    floor((windowWidth * 3) / 10) -
                    floor(
                        (OPPONENT_BOARD_CELL_SIZE * BOARD_WIDTH) / 2 +
                            OPPONENT_BOARD_BORDER_SIZE
                    ),
                topLeftY:
                    floor(windowHeight / 4) -
                    floor(
                        (OPPONENT_BOARD_CELL_SIZE * BOARD_HEIGHT) / 2 +
                            OPPONENT_BOARD_BORDER_SIZE
                    ),
            };
            PLACEMENT["LEFT_BOTTOM_LEFT"] = {
                topLeftX:
                    floor(windowWidth / 10) -
                    floor(
                        (OPPONENT_BOARD_CELL_SIZE * BOARD_WIDTH) / 2 +
                            OPPONENT_BOARD_BORDER_SIZE
                    ),
                topLeftY:
                    floor((windowHeight * 3) / 4) -
                    floor(
                        (OPPONENT_BOARD_CELL_SIZE * BOARD_HEIGHT) / 2 +
                            OPPONENT_BOARD_BORDER_SIZE
                    ),
            };
            PLACEMENT["LEFT_BOTTOM_RIGHT"] = {
                topLeftX:
                    floor((windowWidth * 3) / 10) -
                    floor(
                        (OPPONENT_BOARD_CELL_SIZE * BOARD_WIDTH) / 2 +
                            OPPONENT_BOARD_BORDER_SIZE
                    ),
                topLeftY:
                    floor((windowHeight * 3) / 4) -
                    floor(
                        (OPPONENT_BOARD_CELL_SIZE * BOARD_HEIGHT) / 2 +
                            OPPONENT_BOARD_BORDER_SIZE
                    ),
            };
            PLACEMENT["RIGHT_UPPER_LEFT"] = {
                topLeftX:
                    floor((windowWidth * 6) / 10) +
                    floor(
                        (OPPONENT_BOARD_CELL_SIZE * BOARD_WIDTH) / 2 +
                            OPPONENT_BOARD_BORDER_SIZE
                    ),
                topLeftY:
                    floor(windowHeight / 4) -
                    floor(
                        (OPPONENT_BOARD_CELL_SIZE * BOARD_HEIGHT) / 2 +
                            OPPONENT_BOARD_BORDER_SIZE
                    ),
            };
            PLACEMENT["RIGHT_UPPER_RIGHT"] = {
                topLeftX:
                    floor((windowWidth * 8) / 10) +
                    floor(
                        (OPPONENT_BOARD_CELL_SIZE * BOARD_WIDTH) / 2 +
                            OPPONENT_BOARD_BORDER_SIZE
                    ),
                topLeftY:
                    floor(windowHeight / 4) -
                    floor(
                        (OPPONENT_BOARD_CELL_SIZE * BOARD_HEIGHT) / 2 +
                            OPPONENT_BOARD_BORDER_SIZE
                    ),
            };
            PLACEMENT["RIGHT_BOTTOM_LEFT"] = {
                topLeftX:
                    floor((windowWidth * 6) / 10) +
                    floor(
                        (OPPONENT_BOARD_CELL_SIZE * BOARD_WIDTH) / 2 +
                            OPPONENT_BOARD_BORDER_SIZE
                    ),
                topLeftY:
                    floor((windowHeight * 3) / 4) -
                    floor(
                        (OPPONENT_BOARD_CELL_SIZE * BOARD_HEIGHT) / 2 +
                            OPPONENT_BOARD_BORDER_SIZE
                    ),
            };
            PLACEMENT["RIGHT_BOTTOM_RIGHT"] = {
                topLeftX:
                    floor((windowWidth * 8) / 10) +
                    floor(
                        (OPPONENT_BOARD_CELL_SIZE * BOARD_WIDTH) / 2 +
                            OPPONENT_BOARD_BORDER_SIZE
                    ),
                topLeftY:
                    floor((windowHeight * 3) / 4) -
                    floor(
                        (OPPONENT_BOARD_CELL_SIZE * BOARD_HEIGHT) / 2 +
                            OPPONENT_BOARD_BORDER_SIZE
                    ),
            };
        },
    };
})();
