import { BOARD_WIDTH, BOARD_HEIGHT } from "../../constants.js";
import { BOARD_PLACEMENT } from "./boardPlacement.js";
import { Board } from "./board.js";
import { Block } from "./block.js";

export function Sketch(socket, user, room) {
  const p5SketchDiv = document.querySelector("#p5-sketch");

  /**
   * @param {import('p5')} p
   */
  const sketch = function (p) {
    /** @type {Board | null} board */
    let board = null;
    /** @type {Block | null} currentBlock */
    let currentBlock = null;
    /** @type {Object.<string, Board>} opponentBoards */
    let opponentBoards = {};

    p.setup = function () {
      board = new Board(BOARD_WIDTH, BOARD_HEIGHT, false, "MAIN");
      currentBlock = new Block("Z", 100, 100);

      p.createCanvas(p5SketchDiv.clientWidth, p5SketchDiv.clientHeight);
      p.background(14, 23, 54);
      BOARD_PLACEMENT.autoCompute(p);

      // place socket handlers here
      socket.on("gameState", (gameState) => {
        parseGameStateData(gameState);
      });

      socket.on("leave game", () => {
        p.remove(); // clear canvas
      });
    };

    p.draw = function () {
      board.draw(p);
      for (var opponentBoard in opponentBoards) {
        opponentBoards[opponentBoard].draw(p);
      }
      currentBlock.draw(p);
    };

    p.windowResized = function () {
      p.resizeCanvas(p5SketchDiv.clientWidth, p5SketchDiv.clientHeight);
      BOARD_PLACEMENT.autoCompute(p);
    };

    function parseGameStateData(gameState) {
      const currentPlayerID = gameState["playerID"];

      if (currentPlayerID == user.id) {
        board.boardState = gameState["board"];
        currentBlock = new Block(
          gameState["currentBlock"]["blockType"],
          gameState["currentBlock"]["blockShape"],
          gameState["currentBlock"]["x"],
          gameState["currentBlock"]["y"]
        );
      } else {
        if (!(currentPlayerID in opponentBoards)) {
          opponentBoards[currentPlayerID] = new Board(
            BOARD_WIDTH,
            BOARD_HEIGHT,
            true,
            BOARD_PLACEMENT.getPlacementFromIndex(Object.keys(opponentBoards).length)
          );
        }
        opponentBoards[currentPlayerID].boardState = gameState["board"];
      }
    }
  };

  // running p5 in on-instance mode and render the canvas at p5-sketch div
  return new p5(sketch, p5SketchDiv);
}

function handleGameState(gameState) {
  // TODO: Probably should find a way to ensure the board object is initialized in the
  // sketch.js setup() before doing anything here
  parseGameStateData(gameState);
}

function handleGameover(gameover) {
  gameoverData = JSON.parse(gameover);
}
