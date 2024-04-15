import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  Session,
} from "@shared/types/socketio";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import roomHandlers from "./handlers/roomHandlers";
import { InMemorySessionStore } from "./sessionStore";
import { randomUUID } from "crypto";
import gameHandlers from "./handlers/gameHandlers";

const PORT = 4000;
const sessionStore = InMemorySessionStore.getInstance();
const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
  httpServer,
  {
    cors: {
      origin: "http://localhost:5173",
    },
  }
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("ok");
});

const onConnection = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
) => {
  const oldSession = sessionStore.findSession(socket.data.sessionId!) ?? {};
  sessionStore.saveSession(socket.data.sessionId!, {
    ...oldSession,
    userId: socket.data.userId!,
    username: socket.data.name!,
  });
  socket.emit("session", {
    sessionId: socket.data.sessionId!,
    userId: socket.data.userId!,
    username: socket.data.name!,
  });
  roomHandlers({ io, socket });
  gameHandlers({ io, socket });
};

io.use((socket, next) => {
  const sessionId: string = socket.handshake.auth.sessionId;

  if (sessionId) {
    const session = sessionStore.findSession(sessionId);
    if (session) {
      socket.data.sessionId = sessionId;
      socket.data.userId = session.userId;
      socket.data.name = session.username;
      return next();
    }
  }
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }

  socket.data.sessionId = randomUUID();
  socket.data.userId = randomUUID();
  socket.data.name = username;
  console.log(socket.data);
  next();
});
io.on("connection", onConnection);

httpServer.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
