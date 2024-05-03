import { Block } from "./block.js";
import { Board } from "./board.js";
class GameState {
    constructor(numPlayers) {
        this.numPlayers = numPlayers;
        this.myBoard = new Board();
        this.myBlock = new Block();

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
        console.log("other players gameState received");
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
        // this.myBlock.draw();
    }
}

export { GameState };
