import { Board } from "./board.js";
import { Block } from "./block.js";

export class Game {
  constructor(roomName, user) {
    this.roomName = roomName;
    this.playerID = user.id;
    this.currentBlock = null;
    this.board = new Board(10, 20);
  }

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
        if (!this.board.canAdd(this.currentBlock)) {
          return "gameloss";
        }
      }
    }

    // Clear Rows
    this.board.clearRows();

    return "success";
  }

  getGameState() {
    return {
      playerID: this.playerID,
      board: this.board.getBoardState(),
      currentBlock: this.currentBlock.getBlockInfo(),
      timeLeft: 300,
    };
  }

  addKeyHandlers(client) {
    client.on("keyTyped", (keyTypedData) => {
      this.keyHandler(JSON.parse(keyTypedData)["keyPressed"]);
    });
  }

  keyHandler(keyPressed) {
    switch (keyPressed) {
      case "a":
        // Move Left
        this.currentBlock.moveLeft();
        if (!this.board.canAdd(this.currentBlock)) {
          this.currentBlock.moveRight();
        }
        break;
      case "d":
        // Move Right
        this.currentBlock.moveRight();
        if (!this.board.canAdd(this.currentBlock)) {
          this.currentBlock.moveLeft();
        }
        break;
      case "q":
        // Rotate Anti-clockwise
        this.currentBlock.rotateAntiClockwise();
        if (!this.board.canAdd(this.currentBlock)) {
          this.currentBlock.rotateClockwise();
        }
        break;
      case "e":
        // Rotate Clockwise
        this.currentBlock.rotateClockwise();
        if (!this.board.canAdd(this.currentBlock)) {
          this.currentBlock.rotateAntiClockwise();
        }
        break;
      case "s":
        // Falls
        this.currentBlock.fall();
        if (!this.board.canAdd(this.currentBlock)) {
          this.currentBlock.rise();
        }
        break;
      case "DROP":
        while (this.board.canAdd(this.currentBlock)) {
          this.currentBlock.fall();
        }
        this.currentBlock.rise();
      case "CHEAT":
        // Cheat Mode: Clears the lowest row
        this.board.clearBottomRow();
        break;
      default:
        break;
    }
  }
}
