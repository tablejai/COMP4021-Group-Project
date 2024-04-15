import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "@shared/types";

import { Server, Socket } from "socket.io";

export type MyServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type MySocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type SocketIo = {
  io: MyServer;
  socket: MySocket;
};

export type Handlers = (server: SocketIo) => void;
