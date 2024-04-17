const express = require("express");

const app = express();

const { createServer } = require("http");
const httpServer = createServer(app);
const io = require("socket.io")(httpServer);

const { FRAME_RATE } = require("../shared/constants");
const { Game } = require("./game/game");

io.listen(9000);

// TODO: Make a class to store the multiplayer game
playerIDs = [];

io.on("connection", (client) => {
    // TODO: Emit some important information through the init connection
    // e.g. game version
    // TODO: Implement multiplayer by making use of playerID and roomID

    playerIDs.push(playerIDs.length);
    let playerID = playerIDs[playerIDs.length - 1];

    let roomName = "room 1";
    let game = new Game(playerID, roomName);
    game.addKeyHandlers(client);

    client.emit("init", { playerID: playerID });
    client.join(roomName);

    startGameInterval(client, game);
});

function startGameInterval(client, game) {
    const intervalID = setInterval(() => {
        const rank = game.update();
        if (rank != -1) {
            // If haven't lose
            io.to(game.roomName).emit(
                "gameState",
                JSON.stringify(game.getGameState())
            );
        } else {
            // If have lost
            io.to(game.roomID).emit("gameOver", { data: "idk man" });
            clearInterval(intervalID);
        }
    }, 1000 / FRAME_RATE);
}
