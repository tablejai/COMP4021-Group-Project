import { Block } from "./block.js";
import { Board } from "./board.js";
import { BLOCK_SHAPES } from "../../constants.js";

class GameState {
    constructor(playerId) {
        this.myPlayerID = playerId;
        this.myBoard = new Board("grid", 30);
        this.myBlock = new Block("type", BLOCK_SHAPES["Z"], 0, 0);
        this.opponentBoards = {};

        this.clear();
    }

    parseMyGameState(gameState) {
        if (gameState.isLost) this.myBoard.isGameOver = true;
        // Parsing the board
        this.myBoard.updateBoard(gameState.board);

        // Parsing the block
        const currentBlock = gameState["currentBlock"];
        this.myBlock = new Block(
            currentBlock["blockType"],
            currentBlock["blockShape"],
            currentBlock["x"],
            currentBlock["y"]
        );
    }

    parseOthersGameState(gameState) {
        const currentPlayerID = gameState["playerID"];
        if (gameState.isLost) this.opponentBoards[currentPlayerID].isGameOver = true;
        if (!(currentPlayerID in this.opponentBoards)) {
            let boardId = `opponent-board-${Object.keys(this.opponentBoards).length + 1}`;
            this.opponentBoards[currentPlayerID] = new Board(boardId, 14);
        }
        this.opponentBoards[currentPlayerID].updateBoard(gameState["board"]);
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
        this.myBlock?.draw();
        Object.values(this.opponentBoards).forEach((board) => {
            board.draw();
        });
    }

    clear() {
        this.myBoard.clear();
        Object.values(this.opponentBoards).forEach((board) => {
            board.clear();
        });
    }
}

export { GameState };
