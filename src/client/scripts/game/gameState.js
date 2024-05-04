import { Block } from "./block.js";
import { Board } from "./board.js";
import { BlockPreview } from "./blockPreview.js";

class GameState {
    constructor(playerId) {
        this.myPlayerID = playerId;
        this.myBoard = new Board("grid", 30);
        // this.myBlock = new Block("type", BLOCK_SHAPES["Z"], 0, 0);
        this.myBlock = null;
        this.preview = new BlockPreview();
        this.opponentBoards = {};

        this.clear();
    }

    parseMyGameState(gameState) {
        if (gameState.isLost) this.myBoard.isGameOver = true;
        // Parsing the board
        this.myBoard.updateBoard(gameState.board);

        gameState.nextBlocks && this.preview.updateBlocks(gameState.nextBlocks);

        // Parsing the block
        const currentBlock = gameState["currentBlock"];
        if (currentBlock) {
            this.myBlock = new Block(
                currentBlock["blockType"],
                currentBlock["blockShape"],
                currentBlock["x"],
                currentBlock["y"]
            );
        }
    }

    parseOthersGameState(gameState) {
        const currentPlayerID = gameState["playerID"];
        if (!(currentPlayerID in this.opponentBoards)) {
            let boardId = `opponent-board-${Object.keys(this.opponentBoards).length + 1}`;
            this.opponentBoards[currentPlayerID] = new Board(boardId, 14);
        }
        this.opponentBoards[currentPlayerID].updateBoard(gameState["board"]);
        if (gameState.isLost) this.opponentBoards[currentPlayerID].isGameOver = true;
    }

    parseGameStates(gameStates) {
        gameStates.forEach((gameState) => {
            const playerID = gameState["playerID"];
            if (playerID == this.myPlayerID) this.parseMyGameState(gameState);
            else this.parseOthersGameState(gameState);
        });
        this.draw();
    }

    draw() {
        this.myBoard.draw();
        this.myBlock?.draw(this.myBoard.ctx);
        this.preview.draw();
        Object.values(this.opponentBoards).forEach((board) => {
            board.draw();
        });
    }

    clear() {
        this.preview.clear();
        this.myBoard.clear();
        Object.values(this.opponentBoards).forEach((board) => {
            board.clear();
        });
    }
}

export { GameState };
