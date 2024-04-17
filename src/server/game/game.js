const { Block } = require("./block");
const { Board } = require("./board");

function spawnNewBlock() {
    if (currentBlock != null) {
        board.addBlockToBoard(currentBlock);
    }
    currentBlock = new Block(Block.getRandomBlockType());
}

board = new Board(10, 20);
currentBlock = null;

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
    // Spawn new blocks when there were no blocks
    if (currentBlock == null) {
        spawnNewBlock();
    }

    // Handle the block falling logics
    if (currentBlock.shouldFall(Date.now())) {
        currentBlock.resetLastDropTicks();
        currentBlock.fall();
        if (!board.canAdd(currentBlock)) {
            currentBlock.rise();
            spawnNewBlock();
        }
    }

    board.clearRows();

    return 1;
}

module.exports = {
    createGameState,
    gameLoop,
};
