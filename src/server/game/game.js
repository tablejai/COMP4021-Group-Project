import { Board } from "./board.js";
import { Block } from "./block.js";
import { ROOM_SIZE } from "../../shared/constants.js";

export class Game {
  /**
   *
   * @param {import("../../server/index.js").Room} room
   */
  constructor(room) {
    this.roomName = room.name;
    this.playerIds = room.players.map((p) => p.id); // Expect to be a list of players
    this.currentBlock = null;
    this.board = new Board(10, 20);
  }

  updateRoom(room) {
    this.roomName = room.name;
    this.playerIds = room.players.map((p) => p.id);
  }

  endGame() {}

  getCurrentBlock() {
    return this.currentBlock;
  }

  spawnNewBlock() {
    if (this.currentBlock != null) {
      this.board.addBlockToBoard(this.currentBlock);
    }

    this.currentBlock = new Block(Block.getRandomBlockType());
  }

  update() {
    // Spawn new blocks when there are no blocks
    if (this.currentBlock == null) {
      this.spawnNewBlock();
    }

    // Handle the block falling logics
    if (this.currentBlock.shouldFall(Date.now())) {
      this.currentBlock.resetLastDropTicks();
      this.currentBlock.fall();
      if (!this.board.canAdd(this.currentBlock)) {
        this.currentBlock.rise();
        this.spawnNewBlock();
      }
    }

    // Clear Rows
    this.board.clearRows();

    return 1;
  }

  getGameState() {
    return {
      board: this.board.getBoardState(),
      currentBlock: this.currentBlock.getBlockInfo(),
      timeLeft: 300,
    };
  }

  handleAction(action, payload) {
    switch (action) {
      case "LEFT":
        // Move Left
        this.currentBlock.moveLeft();
        if (!this.board.canAdd(this.currentBlock)) {
          this.currentBlock.moveRight();
        }
        break;
      case "RIGHT":
        // Move Right
        this.currentBlock.moveRight();
        if (!this.board.canAdd(this.currentBlock)) {
          this.currentBlock.moveLeft();
        }
        break;
      case "ROTANTI":
        // Rotate Anti-clockwise
        this.currentBlock.rotateAntiClockwise();
        if (!this.board.canAdd(this.currentBlock)) {
          this.currentBlock.rotateClockwise();
        }
        break;
      case "ROT":
        // Rotate Clockwise
        this.currentBlock.rotateClockwise();
        if (!this.board.canAdd(this.currentBlock)) {
          this.currentBlock.rotateAntiClockwise();
        }
        break;
      case "DOWN":
        // Falls
        this.currentBlock.fall();
        if (!this.board.canAdd(this.currentBlock)) {
          this.currentBlock.rise();
        }
        break;
      case "CHEAT":
      // do something with payload
      default:
        break;
    }
  }
}
