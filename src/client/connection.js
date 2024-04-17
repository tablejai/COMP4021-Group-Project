const socket = io("http://localhost:9000", { transports: ["websocket"] });

socket.on("init", handleInit);
socket.on("gameState", handleGameState);
socket.on("gameover", handleGameover);

var myPlayerID = null;

function handleInit(msg) {
    myPlayerID = parseInt(JSON.parse(msg["playerID"]));
    console.log(myPlayerID);
}

function parseGameStateData(gameState) {
    gameState = JSON.parse(gameState);

    const currentPlayerID = gameState["playerID"];

    if (currentPlayerID == myPlayerID) {
        board.boardState = gameState["board"];
        currentBlock = new Block(
            gameState["currentBlock"]["blockType"],
            gameState["currentBlock"]["blockShape"],
            gameState["currentBlock"]["x"],
            gameState["currentBlock"]["y"]
        );
    } else {
        if (!(currentPlayerID in opponentBoards)) {
            opponentBoards[currentPlayerID] = new Board(
                BOARD_WIDTH,
                BOARD_HEIGHT,
                true,
                BOARD_PLACEMENT.getPlacementFromIndex(
                    Object.keys(opponentBoards).length
                )
            );
        }
        opponentBoards[currentPlayerID].boardState = gameState["board"];
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
