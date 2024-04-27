import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import bcrypt from "bcrypt";
import fs from "node:fs";
import path from "node:path";

import { PORT, FRAME_RATE, NUM_SUPPORTED_PLAYERS } from "../shared/constants.js";
import { Game } from "./game/game.js";
import session from "express-session";
import { randomUUID } from "crypto";

const app = express();
app.use(express.static(path.join(import.meta.dirname, "../client")));
app.use(express.static(path.join(import.meta.dirname, "../shared")));
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer);

const playerSession = session({
  secret: "tetris 9",
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: { maxAge: 300000 },
});
app.use(playerSession);

app.post("/join", (req, res) => {
  const { username } = req.body;

  req.session.user = { username, id: randomUUID() };
  res.json({ status: "success", user });
});

// Keep user in the room on refresh
app.get("/validate", (req, res) => {
  if (req.session.user) {
    res.json({ status: "success", user: req.session.user });
  } else {
    res.json({ status: "error" });
  }
});

app.post("/leave", (req, res) => {
  req.session.destroy();
  res.json({ status: "success" });
});

// TODO: Make a class to store the multiplayer game

const roomName = "room 1";
const rooms = {
  [roomName]: {
    name: roomName,
    /**
     * players: {
     *  id: string
     *  username: string
     *  status: "ready" | "playing" | "offline"
     * }[]
     */
    players: [],
    // and other metadata
  },
};

io.use((socket, next) => {
  playerSession(socket.request, {}, next);
});

io.on("connection", (socket) => {
  const { user } = socket.request.session;

  if (!user) {
    socket.disconnect(true);
    return;
  }

  // if room is full, disconnect and redirect to lobby with reason
  if (io.sockets.adapter.rooms.get(roomName).size >= NUM_SUPPORTED_PLAYERS) {
    socket.emit("room full", { reason: "room is full" });
    socket.disconnect(true);
    return;
  }

  // if user was already in the room, join the room again
  if (rooms[socket.request.session.room]?.players.map((p) => p.id).includes(user.id)) {
    socket.join(socket.request.session.room);
  } else {
    // join room as a new player (currently only one room is supported)
    socket.join(roomName);
    rooms[roomName].players.push({ ...user, status: "ready" });
    socket.request.session.room = roomName;
    socket.emit("init", { room: rooms[roomName] });
    io.to(roomName).emit("add player", { user });
  }

  socket.on("get room", () => {
    socket.emit("room", { room: rooms[roomName] });
  });

  socket.on("leave room", () => {
    socket.leave(roomName);
    rooms[roomName].players = rooms[roomName].players.filter((p) => p.id !== user.id);
    socket.request.session.room = null;
    socket.request.session.destroy();
    io.to(roomName).emit("remove player", { user });
  });

  socket.on("disconnect", () => {
    const player = rooms[roomName].players.find((p) => p.id === user.id);
    if (player) {
      player.status = "offline";
    }
    io.to(roomName).emit("player offline", { user });
  });

  // check
});

// io.on("connection", (client) => {
//   // TODO: Emit some important information through the init connection
//   // e.g. game version
//   // TODO: Implement multiplayer by making use of playerID and roomID

//   playerIDs.push(playerIDs.length);
//   let playerID = playerIDs[playerIDs.length - 1];

//   let roomName = "room 1";
//   let game = new Game(playerID, roomName);
//   game.addKeyHandlers(client);

//   client.emit("init", { playerID: playerID });
//   client.join(roomName);

//   startGameInterval(client, game);
// });

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
