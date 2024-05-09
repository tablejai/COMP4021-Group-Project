import { Block } from "./block.js";
import { Board } from "./board.js";
import { BlockPreview } from "./blockPreview.js";
import { THREE_MINUTES } from "../../constants.js";

class GameState {
    constructor(playerId) {
        this.myPlayerID = playerId;
        this.myBoard = new Board("grid", 30);
        // this.myBlock = new Block("type", BLOCK_SHAPES["Z"], 0, 0);
        this.myBlock = null;
        this.preview = new BlockPreview();
        this.opponentBoards = {};
        this.gameScore = {};
        // this.gameOverTime = null;

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

    parseGameEndStates(gameStates, startTime) {
        document.getElementById("game-end").style.display = "flex";
        let player = null;
        gameStates.forEach((gameState) => {
            const playerID = gameState["playerID"];
            if (gameState.time === null) {
                gameState.time = startTime + THREE_MINUTES;
            }
            if (playerID == this.myPlayerID) {
                console.log("My time:", gameState.time, "; start time:", startTime);
                const time = gameState.time - startTime;
                const min = Math.floor(time / 60 / 1000);
                const sec = Math.floor(time / 1000) % 60;
                const ms = Math.floor(time / 10) % 100;
                document.getElementById("time").textContent = `Time: ${
                    min < 10 ? `0${min}` : min
                }:${sec < 10 ? `0${sec}` : sec}:${ms < 10 ? `0${ms}` : ms}`;
                document.getElementById(
                    "rowCleared"
                ).textContent = `Rows Cleared: ${gameState.rowCleared}`;
                // document.getElementById("garbageRow").textContent = `Garbage Rows Sent: ${gameState.garbageRow}`;
                player = gameState["playerName"];
            }
            this.gameScore[gameState["playerName"]] = {
                time: gameState.time - startTime,
                rowCleared: gameState.rowCleared,
                // garbageRow: gameState.garbageRow
            };
        });
        const rankingsTable = document.getElementById("rankings");
        while (rankingsTable.rows.length > 1) {
            rankingsTable.deleteRow(1);
        }
        const sortedScores = Object.entries(this.gameScore).sort((a, b) => {
            if (a[1].time !== b[1].time) {
                return b[1].time - a[1].time;
            } else {
                // if (a[1].rowCleared !== b[1].rowCleared) {
                return b[1].rowCleared - a[1].rowCleared;
            }
            // else {
            //     return b[1].garbageRow - a[1].garbageRow;
            // }
        });
        let count = 1;
        sortedScores.forEach(([playerID, score]) => {
            const { time, rowCleared } = score; //, garbageRow
            const row = rankingsTable.insertRow();
            row.insertCell().textContent = count++;
            row.insertCell().textContent = playerID;
            const min = Math.floor(time / 60 / 1000);
            const sec = Math.floor(time / 1000) % 60;
            const ms = Math.floor(time / 10) % 100;
            row.insertCell().textContent = `${min < 10 ? `0${min}` : min}:${
                sec < 10 ? `0${sec}` : sec
            }:${ms < 10 ? `0${ms}` : ms}`;

            row.insertCell().textContent = rowCleared;
            // row.insertCell().textContent = garbageRow;
            if (playerID == player) {
                row.style.backgroundColor = "red";
            }
        });
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
