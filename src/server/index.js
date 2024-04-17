const express = require("express");

const app = express();

const { createServer } = require("http");
const httpServer = createServer(app);
const io = require("socket.io")(httpServer);

const { FRAME_RATE } = require("../shared/constants");
const { Game } = require("./game/game");

io.listen(9000);

io.on("connection", (client) => {
    // TODO: Emit some important information through the init connection
    // e.g. game version
    // TODO: Implement multiplayer by making use of playerID and roomID

    let playerID = 1;
    let roomID = 1;
    client.emit("init", { playerID: playerID });

    let game = new Game(playerID, roomID);
    game.addKeyHandlers(client);

    startGameInterval(client, game);
});

function startGameInterval(client, game) {
    const intervalID = setInterval(() => {
        const rank = game.update();
        if (rank != -1) {
            // If haven't lose
            client.emit("gameState", JSON.stringify(game.getGameState()));
        } else {
            // If have lost
            client.emit("gameOver", { data: "idk man" });
            clearInterval(intervalID);
        }
    }, 1000 / FRAME_RATE);
}
