import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import bcrypt from "bcrypt";
import fs from "node:fs";
import path from "node:path";

import { PORT, FRAME_RATE } from "../shared/constants.js";
import { Game } from "./game/game.js";

const app = express();
app.use(express.static(path.join(import.meta.dirname, "../client")));
app.use(express.static(path.join(import.meta.dirname, "../shared")));
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer);

// TODO: Make a class to store the multiplayer game
const playerIDs = [];

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
      io.to(game.roomName).emit("gameState", JSON.stringify(game.getGameState()));
    } else {
      // If have lost
      io.to(game.roomID).emit("gameOver", { data: "idk man" });
      clearInterval(intervalID);
    }
  }, 1000 / FRAME_RATE);
}

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
