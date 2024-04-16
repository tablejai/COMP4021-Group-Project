const { Block } = require("./block");
const { Board } = require("./board");

let board = new Board(10, 20);
let currentBlock = new Block(Block.getRandomBlockType());

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
    return 1;
}

function spawnNewBlock() {
    currentBlock = new Block(Block.getRandomBlockType(), 0, 0);
}

module.exports = {
    createGameState,
    gameLoop,
};
