const express = require("express");

const app = express();

const { createServer } = require("http");
const httpServer = createServer(app);
const io = require("socket.io")(httpServer);

const { createGameState, gameLoop } = require("./game/game");
const { FRAME_RATE } = require("./constants");

io.listen(8000);

io.on("connection", client => {
    // TODO: Emit some important information through the init connection
    // e.g. game version
    client.emit("init", { data: "Yay you came" })

    const gameState = createGameState();
    startGameInterval(client, state)
});

function startGameInterval(client, gameState) { 
    const intervalID = setInterval(() => {
        const rank = gameLoop(gameState);

        if (rank != -1) {
            // If haven't lose
            client.emit("gameState", JSON.stringify(gameState));
        } else { 
            // If have lost
            client.emit("gameOver", gameState);
            clearInterval(intervalID);
        }
    }, 1000 / FRAME_RATE);
}
