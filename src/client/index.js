const socket = io("http://localhost:8000", { transports: ["websocket"] });

socket.on("init", handleInit);
socket.on("gamestate", handleGameState);

function handleInit(msg) {
    console.log(msg);
}

function handleGameState(gameState) {
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => paintGame(gameState));
}