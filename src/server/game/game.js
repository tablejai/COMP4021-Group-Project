const { Block } = require("./block");
const { Board } = require("./board");

let board = new Board(10, 20);

let currentBlock = null;

function spawnNewBlock() {
    if (currentBlock != null) {
        board.addBlockToBoard(currentBlock);
    }
    currentBlock = new Block(Block.getRandomBlockType());
}

function createGameState() {
    // TODO: Check if board and currentBlock is initialized or not
    return {
        player: 1,
        board: board.getBoardState(),
        currentBlock: currentBlock.getBlockInfo(),
        timeLeft: 300,
    };
}

function gameLoop() {
    // Where the actual game loop happens
    if (currentBlock == null) {
        spawnNewBlock();
    }

    if (currentBlock.shouldFall(Date.now())) {
        currentBlock.resetLastDropTicks();
        currentBlock.fall();
        if (!board.canAdd(currentBlock)) {
            currentBlock.rise();
            spawnNewBlock();
        }
    }

    return 1;
}

module.exports = {
    createGameState,
    gameLoop,
};
