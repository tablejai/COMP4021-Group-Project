export enum Direction {
  CLOCKWISE = "CLOCKWISE",
  ANTICLOCKWISE = "ANTICLOCKWISE",
}

export interface Room {
  id: string;
  code: string;
  name: string;
  numPeople: number;
  numRounds: number;
  direction: Direction;
}

export type RoomInput = Omit<Room, "id" | "code"> & { passcode?: string };

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  order: number;
}

export type RoomIdentifier = { roomCode: string; passcode?: string };
