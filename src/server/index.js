import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import bcrypt from "bcrypt";
import fs from "node:fs";
import path from "node:path";

import { PORT, FRAME_RATE, ROOM_SIZE } from "../shared/constants.js";
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

app.post("/signin", (req, res) => {
  const { username } = req.body;

  const user = { id: randomUUID(), username };
  req.session.user = user;
  res.json({ status: "success", user });
});

app.post("/signup", (req, res) => {});

// Keep user in the room on refresh
app.get("/validate", (req, res) => {
  if (req.session.user) {
    res.json({ status: "success", user: req.session.user });
  } else {
    res.json({ status: "error", error: "user not logged in" });
  }
});

app.post("/leave", (req, res) => {
  req.session.destroy();
  res.json({ status: "success" });
});

const onlineUserIds = new Set();
const rooms = Object.fromEntries(
  ["Room 1", "Room 2", "Room 3"].map((roomName) => [
    roomName,
    {
      name: roomName,
      players: [],
    },
  ])
);
// const rooms = {
//   [roomName]: {
//     name: roomName,
//     /**
//      * players: {
//      *  id: string
//      *  username: string
//      *  status: "ready" | "playing" | "offline"
//      * }[]
//      */
//     players: [],
//     // and other metadata
//   },
// };

io.use((socket, next) => {
  playerSession(socket.request, {}, next);
});

io.on("connection", (socket) => {
  const { user, roomName } = socket.request.session;

  if (!user) {
    socket.disconnect(true);
    return;
  }

  onlineUserIds.add(user.id);

  // if user was already in the room, join the room again
  // TODO: check if game in that room is over
  if (roomName && rooms[roomName]?.players.map((p) => p.id).includes(user.id)) {
    socket.leave("lobby");
    socket.join(roomName);
    socket.emit("player online", user);
  } else {
    socket.join("lobby");
  }

  socket.onAny((eventName, ...args) => {
    switch (eventName) {
      case "add player":
      case "remove player":
        // update users in lobby about the room list
        io.to("lobby").emit("room list", rooms);
        break;
    }
  });

  socket.on("join room", (roomName) => {
    if (!rooms[roomName]) {
      socket.emit("room error", { reason: "room not found" });
      return;
    }
    // if room is full, disconnect and redirect to lobby with reason
    if ((rooms[roomName]?.players.length ?? 0) >= ROOM_SIZE) {
      socket.emit("room error", { reason: "room is full" });
      return;
    }

    // join room as a new player
    socket.leave("lobby");
    socket.join(roomName);
    rooms[roomName].players.push({ ...user, status: "ready" });
    socket.request.session.room = roomName;

    // emit initial game data
    socket.emit("init", { room: rooms[roomName] });
    io.to(roomName).emit("add player", user);
  });

  socket.on("get room", () => {
    socket.emit("room", rooms[socket.request.session.roomName]);
  });

  socket.on("leave room", () => {
    const roomName = socket.request.session.roomName;
    socket.leave(roomName);
    socket.join("lobby");

    rooms[roomName].players = rooms[roomName].players.filter((p) => p.id !== user.id);
    socket.request.session.roomName = null;
    io.to(roomName).emit("remove player", user);
  });

  socket.on("disconnect", () => {
    const player = rooms[roomName].players.find((p) => p.id === user.id);
    if (player) {
      player.status = "offline";
    }
    onlineUserIds.delete(user.id);
    io.to(roomName).emit("player offline", user);
  });
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
