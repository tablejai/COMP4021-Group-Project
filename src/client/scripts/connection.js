import { THREE_MINUTES } from "../../constants.js";
import { GameState } from "./game/gameState.js";
import { handleKeyPress } from "./game/interaction.js";

function Connection(user) {
    const socket = io();
    let currentGameState = null;
    let playerReady = false;

    const connect = () => {
        socket.connect();
    };

    const disconnect = () => {
        socket.disconnect();
    };

    socket.on("connect", () => {
        console.log("connected");
        socket.emit("get roomList");
        const lobbyOverlay = document.querySelector("#lobby-overlay");
        lobbyOverlay.classList.remove("hidden");
    });

    socket.on("room list", (roomList) => {
        console.log(roomList);

        // update room list ui
        const roomListDiv = document.querySelector("#room-list");
        const rooms = Object.values(roomList).map(({ name, players, size }) => {
            const isGameStarted = players.some((player) => player.status === "playing");

            const room = document.createElement("div");
            room.classList.add("room");

            isGameStarted && room.classList.add("disabled");
            room.title = isGameStarted ? "Game is in progress" : "Click to join";

            room.innerHTML = `
        <span class="room-name">${name}</span>
        <p>Players: ${players.length}/${size}</p>
      `;
            !isGameStarted &&
                room.addEventListener("click", () => {
                    socket.emit("join room", name);
                });
            return room;
        });

        roomListDiv.replaceChildren(...rooms);
    });

    socket.on("room error", ({ reason }) => {
        console.error("Room error: ", reason);
        const message = document.querySelector("#lobby-message");
        message.textContent = reason;
    });

    socket.on("init", ({ room }) => {
        console.log(room);
        const lobbyOverlay = document.querySelector("#lobby-overlay");
        const leaveGame = document.querySelector("#header-leave");
        const readyButton = document.querySelector("#ready-button");
        const gameEndOverlay = document.querySelector("#game-end");
        gameEndOverlay.classList.add("hidden");
        lobbyOverlay.classList.add("hidden");
        leaveGame.classList.remove("hidden");
        leaveGame.onclick = () => {
            socket.emit("leave room");
            lobbyOverlay.classList.remove("hidden");
            leaveGame.classList.add("hidden");
        };
        readyButton.classList.remove("hidden");
        playerReady = false;
        readyButton.onclick = () => {
            socket.emit("ready");
            readyButton.classList.add("hidden");
            playerReady = true;
            const timeLeftDiv = document.querySelector("#timer");
            timeLeftDiv.classList.remove("hidden");
            const title = document.querySelector("#title");
            title.style.position = "absolute";
        };

        currentGameState = new GameState(user.id);
    });

    socket.on("resume", (isLost) => {
        const readyButton = document.querySelector("#ready-button");
        readyButton.classList.add("hidden");
        playerReady = true;
        const timeLeftDiv = document.querySelector("#timer");
        timeLeftDiv.classList.remove("hidden");
        const title = document.querySelector("#title");
        title.style.position = "absolute";

        if (isLost) {
            return;
        }
        window.onkeydown = (e) => {
            if (e.isComposing || e.keyCode === 229) {
                return;
            }
            const msg = handleKeyPress(e);
            msg && socket.emit("action", msg);
        };
    });

    socket.on("add player", (player) => {
        console.log("Add player", player);
    });

    // game related events

    socket.on("game start", () => {
        window.onkeydown = (e) => {
            if (e.isComposing || e.keyCode === 229) {
                return;
            }
            const msg = handleKeyPress(e);
            msg && socket.emit("action", msg);
        };
    });

    socket.on("game states", (gameStates, timeLeft = THREE_MINUTES) => {
        if (!playerReady) return;
        const timeLeftDiv = document.querySelector("#timer");
        const min = Math.max(Math.floor(timeLeft / 60 / 1000), 0);
        const sec = Math.max(Math.floor(timeLeft / 1000) % 60, 0);
        const ms = Math.max(Math.floor(timeLeft / 10) % 100, 0);

        // pad the numbers with 0
        timeLeftDiv.textContent = `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}:${
            ms < 10 ? `0${ms}` : ms
        }`;
        currentGameState.parseGameStates(gameStates);
    });

    socket.on("gameover", (gameOver) => {
        window.onkeydown = null;
        console.log("Game Over", gameOver);
    });

    socket.on("game end", (gameState, startTime) => {
        window.onkeydown = null;
        console.log("Game end", gameState);
        currentGameState.parseGameEndStates(gameState, startTime);

        // Show game end
        const gameEndOverlay = document.querySelector("#game-end");
        gameEndOverlay.classList.remove("hidden");

        const restartButton = document.querySelector("#restart-button");
        restartButton.addEventListener("click", () => {
            socket.emit("leave room");
            const gameEndOverlay = document.querySelector("#game-end");
            gameEndOverlay.classList.add("hidden");
            const lobbyOverlay = document.querySelector("#lobby-overlay");
            lobbyOverlay.classList.remove("hidden");
            const timeLeftDiv = document.querySelector("#timer");
            timeLeftDiv.classList.add("hidden");
            const title = document.querySelector("#title");
            title.style.position = "static";
        });
    });
    socket.on("leave game", () => {
        currentGameState.clear();
        currentGameState = null;
    });
    return {
        connect,
        disconnect,
    };
}
export { Connection };
