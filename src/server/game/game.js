import { Board } from "./board.js";
import { Block } from "./block.js";

export class Game {
    constructor(roomName, user) {
        this.roomName = roomName;
        this.playerID = user.id;
        this.currentBlock = null;
        this.board = new Board(10, 20);
        this.isLost = false;
        this.gameOverHandler = null;
        this.clearRowHandler = null;
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

    addGarbageRow(numGarbageRow) {
        this.board.addGarbageRow(numGarbageRow);
    }

    addGameOverHandler(callback) {
        this.gameOverHandler = callback.bind(this);
    }

    // Clunky name but nvm
    addClearRowHandler(callback) {
        this.clearRowHandler = callback;
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
        const rowsCleared = this.board.clearRows();
        if (rowsCleared > 0) {
            // TODO: Figure out a more playable way for numGarbageRow to be determined
            const numGarbageRow = rowsCleared;
            this.clearRowHandler(this.playerID, numGarbageRow);
        }
    }

    getGameState() {
        return {
            playerID: this.playerID,
            board: this.board.getBoardState(),
            currentBlock: this.currentBlock.getBlockInfo(),
            isLost: this.isLost,
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
