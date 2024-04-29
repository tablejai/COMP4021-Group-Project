import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import bcrypt from "bcrypt";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PORT, FRAME_RATE, ROOM_SIZE } from "../shared/constants.js";
import { Game } from "./game/game.js";
import session from "express-session";
import { randomUUID } from "crypto";

const __dirname = import.meta.dirname || fileURLToPath(new URL(".", import.meta.url));
const __filename = import.meta.filename || fileURLToPath(import.meta.url);

const app = express();
app.use(express.static(path.join(__dirname, "../client")));
app.use(express.static(path.join(__dirname, "../shared")));
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

function containAlphaNumericOnly(str) {
  return /^[a-zA-Z0-9_]+$/.test(str);
}

app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({
      status: "error",
      error: "Username and password should not be empty",
    });
  }

  if (!containAlphaNumericOnly(username)) {
    return res.json({
      status: "error",
      error: "Username should only contain alphanumeric characters and underscores",
    });
  }

  const users = JSON.parse(fs.readFileSync(path.join(__dirname, "data/users.json"), "utf-8"));

  if (users[username]) {
    return res.json({
      status: "error",
      error: "Username already exists",
    });
  }

  const hash = bcrypt.hashSync(password, 9);
  users[username] = { password: hash, id: randomUUID() };
  fs.writeFileSync(path.join(__dirname, "data/users.json"), JSON.stringify(users, null, 2));

  res.json({ status: "success" });
});

app.post("/signin", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({
      status: "error",
      error: "Username and password should not be empty",
    });
  }

  if (!containAlphaNumericOnly(username)) {
    return res.json({
      status: "error",
      error: "Username should only contain alphanumeric characters and underscores",
    });
  }

  const users = JSON.parse(fs.readFileSync(path.join(__dirname, "data/users.json"), "utf-8"));
  if (!(username in users)) {
    return res.json({
      status: "error",
      error: "Invalid username/password",
    });
  }

  if (!bcrypt.compareSync(password, users[username].password)) {
    return res.json({
      status: "error",
      error: "Invalid username/password",
    });
  }

  req.session.user = { username, id: users[username].id };
  res.json({ status: "success", user: { username, id: users[username].id } });
});

// Keep user in the room on refresh
app.get("/validate", (req, res) => {
  if (req.session.user) {
    res.json({ status: "success", user: req.session.user });
  } else {
    res.json({ status: "error", error: "user not logged in" });
  }
});

app.get("/signout", (req, res) => {
  req.session.destroy();
  res.json({ status: "success" });
});

const onlineUserIds = new Set();

/**
 * @typedef {{ id: string, username: string, status: "ready" | "playing" | "offline" }} Player
 * @typedef {{ name: string, players: Player[], size: number }} Room
 * @type {Record<"Room 1" | "Room 2" | "Room 3", Room>}
 */
const rooms = Object.fromEntries(
  ["Room 1", "Room 2", "Room 3"].map((roomName) => [
    roomName,
    {
      name: roomName,
      players: [],
      size: ROOM_SIZE,
    },
  ])
);

io.use((socket, next) => {
  playerSession(socket.request, {}, next);
});

io.on("connection", (socket) => {
  const { user, roomName } = socket.request.session;

  // user is not authenticated, disconnect
  if (!user) {
    socket.disconnect(true);
    return;
  }

  onlineUserIds.add(user.id);

  // if user was already in the room, join the room again
  // TODO: check if game in that room is over
  if (roomName && rooms[roomName]?.players.map((p) => p.id).includes(user.id)) {
    socket.join(roomName);
    socket.emit("player online", user);
    socket.emit("init", { room: rooms[roomName] });
  } else {
    console.log("join lobby", user);
    socket.join("lobby");
  }

  socket.onAnyOutgoing((eventName, ...args) => {
    console.log("OUT: ", eventName, args);
    switch (eventName) {
      case "add player":
      case "remove player":
        // update users in lobby about the room list
        io.to("lobby").emit("room list", rooms);
        break;
    }
  });

  socket.onAny((eventName, ...args) => {
    console.log("IN: ", eventName, args);
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
    socket.request.session.roomName = roomName;
    socket.request.session.save();

    // emit initial game data
    socket.emit("init", { room: rooms[roomName] });
    io.to(roomName).emit("add player", user);
  });

  socket.on("get room", () => {
    socket.emit("room", rooms[socket.request.session.roomName]);
  });

  socket.on("get roomList", () => {
    socket.emit("room list", rooms);
  });

  socket.on("leave room", () => {
    const roomName = socket.request.session.roomName;
    console.log("leave room", roomName);
    if (!roomName) return;

    socket.leave(roomName);
    socket.join("lobby");

    rooms[roomName].players = rooms[roomName].players.filter((p) => p.id !== user.id);
    socket.request.session.roomName = null;
    socket.request.session.save();
    socket.emit("leave game");
    socket.emit("remove player", user);
    io.to(roomName).emit("remove player", user);
  });

  socket.on("disconnect", () => {
    const roomName = socket.request.session.roomName;
    console.log("disconnect", roomName);
    const player = rooms[roomName]?.players.find((p) => p.id === user.id);
    if (player) {
      player.status = "offline";
      io.to(roomName).emit("player offline", user);
    }

    onlineUserIds.delete(user.id);
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
