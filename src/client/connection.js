const socket = io("http://localhost:9000", { transports: ["websocket"] });

socket.on("init", handleInit);
socket.on("gameState", handleGameState);
socket.on("gameover", handleGameover);

playerID = null;

function handleInit(msg) {
    playerID = JSON.parse(msg["playerID"]);
    console.log(playerID);
}

function parseGameStateData(gameState) {
    gameState = JSON.parse(gameState);

    if (gameState["playerID"] == parseInt(playerID)) {
        board.boardState = gameState["board"];
        currentBlock = new Block(
            gameState["currentBlock"]["blockType"],
            gameState["currentBlock"]["blockShape"],
            gameState["currentBlock"]["x"],
            gameState["currentBlock"]["y"]
        );
    }
}

function handleGameState(gameState) {
    // TODO: Probably should find a way to ensure the board object is initialized in the
    // sketch.js setup() before doing anything here
    parseGameStateData(gameState);
}

function handleGameover(gameover) {
    gameoverData = JSON.parse(gameover);
}
