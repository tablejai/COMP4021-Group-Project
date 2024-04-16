function createGameState() { 
    return {
        player: 1,
        boardstates: {
        },
        timeLeft : 300
    }
}

function gameLoop(gameState) { 
    // Where the actual game loop happens


}

module.exports = {
    createGameState,
    gameLoop
}