import { Player, Room, RoomInput } from "./room";

export type Maybe<T> = T | null;

export interface ServerToClientEvents {
  session: (data: { sessionId: string; userId: string; username: string }) => void;
  "room:playerJoined": (data: { playerId: string; players: Player[] }) => void;
  "room:playerLeft": (data: { playerId: string; players: Player[] }) => void;
  "room:joined": (data: { room: Room }) => void;
  "room:deleted": (roomId: string) => void;
}

export interface ClientToServerEvents {
  "room:create": (
    playerName: string,
    roomData: RoomInput,
    callback: (error: Maybe<string>) => void
  ) => void;
  "room:delete": (callback: (error: Maybe<string>) => void) => void;
  "room:join": (
    playerName: string,
    roomData: { roomCode: string; passcode?: string },
    callback: (error: Maybe<string>) => void
  ) => void;
  "room:leave": (callback: (error: Maybe<string>) => void) => void;
  "room:kickPlayer": (playerId: string, callback: (error: Maybe<string>) => void) => void;
  "game:start": (roomId: string, callback: (error: Maybe<string>) => void) => void;
  "game:end": (roomId: string, callback: (error: Maybe<string>) => void) => void;
}

export interface InterServerEvents {}

export interface SocketData {
  sessionId: string;
  userId: string;
  roomId?: string;
  name: string;
  isHost?: boolean;
  order: number;
}

export interface Session {
  userId: string;
  username: string;
  roomId?: string;
}
