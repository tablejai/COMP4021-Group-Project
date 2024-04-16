const socket = io("http://localhost:9000", { transports: ["websocket"] });

socket.on("init", handleInit);
socket.on("gameState", handleGameState);
socket.on("gameover", handleGameover);

function handleInit(msg) {
    console.log(msg);
}

function handleGameState(gameState) {
    gameState = JSON.parse(gameState);
    console.log(gameState);
    // requestAnimationFrame(() => paintGame(gameState));
}

function handleGameover(gameover) { 
    gameoverData = JSON.parse(gameover);
    console.log(gameover);
}