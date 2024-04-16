function createEmptyBoard() { 
    return Array(20).fill(0).map(() => Array(10).fill(0));
}
function createGameState() { 
    return {
        player: 1,
        board: createEmptyBoard(),
        timeLeft : 300
    }
}

function gameLoop(gameState) { 
    // Where the actual game loop happens
    return 1;
}

module.exports = {
    createGameState,
    gameLoop
}