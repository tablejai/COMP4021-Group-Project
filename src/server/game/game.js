const { Block } = require("./block");
const { Board } = require("./board");

let board = new Board(10, 20);

function spawnNewBlock() {
    return new Block(Block.getRandomBlockType());
}

let currentBlock = spawnNewBlock();
// let currentBlock = new Block(Block.getRandomBlockType());

function createGameState() {
    // TODO: Check if board and currentBlock is initialized or not
    return {
        player: 1,
        board: board.getBoardState(),
        currentBlock: currentBlock.getBlockInfo(),
        timeLeft: 300,
    };
}

function gameLoop(gameState) {
    // Where the actual game loop happens
    console.log(currentBlock.getBlockInfo());
    if (currentBlock.shouldFall(Date.now())) {
        currentBlock.resetLastDropTicks();
        currentBlock.fall();
        if (!board.canAdd(currentBlock)) {
            currentBlock.rise();
            currentBlock = spawnNewBlock();
        }
    }

    return 1;
}

module.exports = {
    createGameState,
    gameLoop,
};
