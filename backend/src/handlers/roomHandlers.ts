import { ClientToServerEvents } from "@shared/types/socketio";
import { Direction, Player } from "@shared/types";
import { Handlers, MySocket } from "./types";
import { randomInt, randomUUID } from "crypto";
import { InMemorySessionStore } from "@/sessionStore";

interface Room {
  id: string;
  code: string;
  name: string;
  numPeople: number;
  numRounds: number;
  direction: Direction;
  passcode?: string;
  sockets: MySocket[];
  order: number; // atomic counter for player order
}

const rooms: Record<string, Room> = {};
const codes: string[] = [];
const sessionStore = InMemorySessionStore.getInstance();

const getRoomByCode = (roomCode: string) => {
  return Object.values(rooms).find(({ code }) => code === roomCode);
};

const getRoomById = (roomId: string) => {
  return Object.values(rooms).find(({ id }) => id === roomId);
};

const randomCode = (): string => {
  const n = randomInt(100000, 999999);
  const code = n.toString().padStart(6, "0");

  if (codes.includes(code)) return randomCode();

  codes.push(code);
  return code;
};

const socketToPlayer = (socket: MySocket): Player => {
  return {
    id: socket.id,
    name: socket.data.name ?? "unknown",
    isHost: socket.data.isHost ?? false,
    order: socket.data.order ?? 999,
  };
};

const roomHandlers: Handlers = ({ io, socket }) => {
  const _joinRoom = (room: Room) => {
    // socket already joined room
    if (room.sockets.findIndex((s) => s.id === socket.id) !== -1) {
      throw new Error(`${socket.id} already joined room ${room.id}`);
    }

    if (room.sockets.length === room.numPeople) {
      throw new Error(`room ${room.id} is full`);
    }

    // add socket to the room
    room.sockets.push(socket);
    socket.join(room.id);
    socket.data.roomId = room.id;
    socket.data.order = ++room.order;
    console.log(`${socket.id} joined room ${room.id}`);

    // save to session
    sessionStore.saveSession(socket.data.sessionId!, {
      roomId: room.id,
      userId: socket.data.userId,
      username: socket.data.name,
      isHost: socket.data.isHost,
    });

    io.in(room.id).emit("room:playerJoined", {
      playerId: socket.id,
      players: room.sockets.map(socketToPlayer),
    });
    const { sockets, passcode, order, ...callbackRoom } = room;
    io.to(socket.id).emit("room:joined", {
      room: callbackRoom,
    });
  };

  const _leaveRoom = () => {
    if (!socket.data.roomId) {
      throw new Error(`${socket.id} is not in any room`);
    }
    const room = rooms[socket.data.roomId];
    const playerIsHost = socket.data.isHost;
    socket.leave(room.id);

    delete socket.data.roomId;
    delete socket.data.isHost;
    room.sockets = room.sockets.filter((s) => s.id !== socket.id);
    if (playerIsHost) {
      // transfer ownership
      const nextSocket = room.sockets.at(0);
      if (nextSocket) {
        nextSocket.data.isHost = true;
        const thisSession = sessionStore.findSession(socket.data.sessionId!);
        sessionStore.saveSession(socket.data.sessionId!, {
          ...thisSession,
          isHost: false,
        });
        const thatSession = sessionStore.findSession(nextSocket.data.sessionId!);
        sessionStore.saveSession(nextSocket.data.sessionId!, {
          ...thatSession,
          isHost: true,
        });
        console.log(`The host of room ${room.id} is transferred to ${nextSocket.id}`);
      }
    }
    console.log(`${socket.id} left room ${room.id}`);
    io.in(room.id).emit("room:playerLeft", {
      playerId: socket.id,
      players: room.sockets.map(socketToPlayer),
    });

    // delete room if no one is here
    // TODO: add a timer to delete room after a certain amount of time
    // if (room.sockets.length === 0) {
    //   console.log(`Room ${room.id} is deleted by the system as no one is in the room`);
    //   socket.broadcast.emit("room:deleted", room.id);

    //   delete rooms[room.id];
    //   return;
    // }
  };

  const createRoom: ClientToServerEvents["room:create"] = (playerName, roomData, callback) => {
    const room: Room = {
      id: randomUUID(),
      code: randomCode(),
      name: roomData.name,
      numPeople: roomData.numPeople,
      numRounds: roomData.numRounds,
      direction: roomData.direction,
      passcode: roomData.passcode,
      sockets: [],
      order: 0,
    };

    socket.data.name = playerName;
    socket.data.isHost = true;
    rooms[room.id] = room;

    _joinRoom(room);
    callback(null);
  };

  const deleteRoom: ClientToServerEvents["room:delete"] = (callback) => {
    if (!socket.data.roomId) {
      console.error("Cannot delete room, no room associated with the user");
      callback("Cannot delete room, no room associated with the user");
      return;
    }

    const room = rooms[socket.data.roomId];

    // broadcast to all clients in the room
    io.in(room.id).emit("room:deleted", room.id);

    for (let s of room.sockets) {
      s.leave(room.id);
      delete s.data.roomId;
    }

    room.sockets = [];
    console.log(`Room ${room.id} is deleted by ${socket.id}`);

    delete rooms[room.id];
    callback(null);
  };

  const joinRoom: ClientToServerEvents["room:join"] = (playerName, roomData, callback) => {
    const { roomId, isHost } = sessionStore.findSession(socket.data.sessionId!);
    console.log(sessionStore.findAllSessions());
    let room = getRoomById(roomId) ?? getRoomByCode(roomData.roomCode);

    if (!room) {
      callback("Room does not exist");
      return;
    }

    socket.data.name = playerName;
    socket.data.isHost = isHost;

    if (room.passcode) {
      if (room.passcode === roomData.passcode) {
        try {
          _joinRoom(room);
          callback(null);
        } catch (e) {
          console.log(e);
          callback((e as Error).message);
        }
        return;
      }
      callback("Passcode is not correct");
    } else {
      try {
        _joinRoom(room);
        callback(null);
      } catch (e) {
        console.log(e);
        callback((e as Error).message);
      }
    }
  };

  const leaveRoom: ClientToServerEvents["room:leave"] = (callback) => {
    try {
      _leaveRoom();
      callback(null);
    } catch (e: any) {
      console.error(e.message);
      callback(e.message);
    }
  };

  const roomKickPlyaer: ClientToServerEvents["room:kickPlayer"] = (playerId, callback) => {
    if (!socket.data.roomId) {
      throw new Error(`${socket.id} is not in any room`);
    }

    const room = rooms[socket.data.roomId];
    const playerIdx = room.sockets.findIndex((s) => s.id === playerId);
    if (playerIdx === -1) {
      throw new Error(`${playerId} not in room ${room.id}`);
    }

    // remove the player from the room
    const player = room.sockets[playerIdx];
    delete player.data.roomId;
    delete player.data.isHost;
    player.emit("room:playerLeft", { playerId: player.id, players: [] });
    player.leave(room.id);
    room.sockets.splice(playerIdx, 1);
    sessionStore.deleteSession(player.data.sessionId!);

    console.log(`${player.id} was kicked out of room ${room.id}`);
    io.in(room.id).emit("room:playerLeft", {
      playerId: player.id,
      players: room.sockets.map(socketToPlayer),
    });
  };

  socket.on("room:create", createRoom);
  socket.on("room:delete", deleteRoom);
  socket.on("room:join", joinRoom);
  socket.on("room:leave", leaveRoom);
  socket.on("room:kickPlayer", roomKickPlyaer);
  socket.on("disconnecting", () => {
    console.log(`${socket.id} disconnected`);
    socket.data.roomId && leaveRoom(() => {});
  });
};

export default roomHandlers;
