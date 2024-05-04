import { Board } from "./board.js";
import { Block } from "./block.js";

export class Game {
    constructor(roomName, user) {
        this.roomName = roomName;
        this.playerID = user.id;
        this.playerName = user.username;
        this.currentBlock = null;
        this.board = new Board(10, 20);
        this.isLost = false;
        this.gameOverHandler = null;
        this.score = 0;
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

    addGameOverHandler(callback) {
        this.gameOverHandler = callback.bind(this);
    }

    update() {
        if (this.isLost) return;
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
                    this.isLost = true;
                    this.gameOverHandler?.();
                }
            }
        }

        // Clear Rows
        this.board.clearRows();
    }

    getGameState() {
        return {
            playerID: this.playerID,
            board: this.board.getBoardState(),
            currentBlock: this.currentBlock?.getBlockInfo(),
            isLost: this.isLost,
        };
    }

    getGameEndState() {
        return {
            playerID: this.playerID,
            playerName: this.playerName,
            score: this.score,
        };
    }

    handleAction(action, payload) {
        if (this.isLost) return;

        console.log(action);

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
            case "DROP":
                while (this.board.canAdd(this.currentBlock)) {
                    this.currentBlock.fall();
                }
                this.currentBlock.rise();
                break;
            case "CHEAT":
                // Cheat Mode: Clears the lowest row
                this.board.clearBottomRow();
                break;
            default:
                break;
        }
    }
}
