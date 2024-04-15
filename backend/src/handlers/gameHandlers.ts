import { ClientToServerEvents } from "@shared/types";
import { Handlers } from "./types";

const gameHandlers: Handlers = ({ io, socket }) => {
  const start: ClientToServerEvents["game:start"] = async (roomId, callback) => {
    if (!socket.rooms.has(roomId)) {
      console.log(`Cannot start game as host is not in room ${roomId}`);
      callback(`Cannot start game as host is not in room ${roomId}`);
      return;
    }

    const sockets = await io.in(roomId).fetchSockets();
    sockets.sort((a, b) => a.data.order - b.data.order);
    // io.in(roomId).emit("game:status", GameState.START, {
    //   currentPlayer: sockets[0].id,
    //   currentRound: 1,
    // });
  };

  const end: ClientToServerEvents["game:end"] = async (roomId, callback) => {
    if (!socket.rooms.has(roomId)) {
      console.log(`Cannot end game as host is not in room ${roomId}`);
      callback(`Cannot end game as host is not in room ${roomId}`);
      return;
    }

    // io.in(roomId).emit("game:status", GameState.END, {
    //   currentPlayer: "",
    //   currentRound: 0,
    // });

    console.log(`The host has ended the game in room ${roomId}`);
  };

  socket.on("game:start", start);
  socket.on("game:end", end);
};

export default gameHandlers;
