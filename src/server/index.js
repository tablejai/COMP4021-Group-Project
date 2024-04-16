const express = require("express");

const app = express();

const { createServer } = require("http");
const httpServer = createServer(app);
const io = require("socket.io")(httpServer);

const { createGameState, gameLoop } = require("./game/game");
const { FRAME_RATE } = require("../shared/constants");

io.listen(9000);

io.on("connection", (client) => {
    // TODO: Emit some important information through the init connection
    // e.g. game version
    client.emit("init", { data: "Yay you came" });

    client.on("keyTyped", (keyTypedData) => {
        console.log(keyTypedData);
    });

    startGameInterval(client);
});

function startGameInterval(client) {
    const intervalID = setInterval(() => {
        const rank = gameLoop();
        if (rank != -1) {
            // If haven't lose
            const gameState = createGameState();
            client.emit("gameState", JSON.stringify(gameState));
        } else {
            // If have lost
            client.emit("gameOver", { data: "idk man" });
            clearInterval(intervalID);
        }
    }, 1000 / FRAME_RATE);
}
