function createEmptyBoard() { 
    return Array(20).fill(0).map(() => Array(10));
}
function createGameState() { 
    return {
        player: 1,
        playerBoard: createEmptyBoard(),
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