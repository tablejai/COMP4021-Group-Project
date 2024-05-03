import { Block } from "./block.js";
import { Board } from "./board.js";
import { BLOCK_SHAPES } from "../../constants.js";
class GameState {
    constructor(numPlayers) {
        this.numPlayers = numPlayers;
        this.myBoard = new Board("grid", 30);
        this.myBlock = new Block("type", BLOCK_SHAPES["Z"], 0, 0);
        this.opponentBoards = {};

        // These 2 to be dealt with
        this.myPlayerID = null;
        this.otherBoardState = null;
    }

    parseMyGameState(gameState) {
        // Parsing the board
        this.myBoard.boardState = gameState["board"];

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
        if (!(currentPlayerID in this.opponentBoards)) {
            console.log("other players gameState received");
            let boardId = `opponent-board-${Object.keys(this.opponentBoards).length + 1}`;
            this.opponentBoards[currentPlayerID] = new Board(
                boardId, 14);
        }
        this.opponentBoards[currentPlayerID].boardState = gameState["board"];
    }

    parseGameState(gameState) {
        const parsedGameState = JSON.parse(gameState);
        const playerID = parsedGameState["playerID"];
        if (playerID == this.myPlayerID) this.parseMyGameState(parsedGameState);
        else this.parseOthersGameState(parsedGameState);
        this.draw();
    }

    draw() {
        this.myBoard.draw();
        if (this.myBlock != null) {
            this.myBlock.draw();
        }
        for (let boardID in this.opponentBoards) {
            this.opponentBoards[boardID].draw();
        }
        // this.myBlock.draw();
    }
}

export { GameState };
