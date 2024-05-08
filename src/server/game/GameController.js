import { FRAME_RATE, THREE_MINUTES } from "../../shared/constants.js";
import { Game } from "./game.js";

export class GameController {
  constructor(roomName) {
    this.roomName = roomName;
    /** @property {Record<string, Game>} games */
    this.games = {};
    this.intervalId = null;
    this.gameStartTime = null;
    this.gameEndTime = null;
    this.timeLimit = THREE_MINUTES;
    this.handleEndGame = null;
  }

  createGame(user) {
    this.games[user.id] = new Game(this.roomName, user);
    this.games[user.id].addClearRowHandler(this.handleClearRow.bind(this));
  }

  getGameState(user) {
    return this.games[user.id].getGameState();
  }

  getGameEndState(user) {
    return this.games[user.id].getGameEndState();
  }

  handleClearRow(playerID, numGarbageRow) {
    console.log(this.games);
    Object.values(this.games).map((game) => {
      if (game.playerID != playerID) {
        game.addGarbageRow(numGarbageRow);
      }
    });
  }

  handleAction(user, action, payload) {
    this.games[user.id].handleAction(action, payload);
    // only change internal state, don't emit event after this
    // rely on updateGame to update the clients
  }

  addGameOverHandler(user, callback) {
    this.games[user.id].addGameOverHandler(callback);
  }

  updateGame(callback) {
    const timeLeft = this.gameEndTime - Date.now();
    const gameStates = Object.values(this.games).map((game) => {
      game.update();
      return game.getGameState();
    });
    callback(gameStates, timeLeft);
    const gameEndStates = Object.values(this.games).map((game) => {
      return game.getGameEndState();
    });
    if (timeLeft <= 0 || gameStates.every((game) => game.isLost)) {
      clearInterval(this.intervalId);
      this.handleEndGame?.(gameEndStates, this.gameStartTime);
    }
  }

  startGameLoop(callback) {
    this.gameStartTime = Date.now();
    this.gameEndTime = this.gameStartTime + this.timeLimit;
    this.intervalId = setInterval(() => {
      this.updateGame(callback);
    }, 1000 / FRAME_RATE);
  }

  addEndGameHandler(callback) {
    this.handleEndGame = callback.bind(this);
  }
}
