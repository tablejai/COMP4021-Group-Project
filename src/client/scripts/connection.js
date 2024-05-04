import { THREE_MINUTES } from "../../constants.js";
import { GameState } from "./game/gameState.js";
import { handleKeyPress } from "./game/interaction.js";

function Connection(user) {
    const socket = io();
    let currentGameState = null;

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
            const room = document.createElement("div");
            room.classList.add("room");
            room.innerHTML = `
        <span class="room-name">${name}</span>
        <p>Players: ${players.length}/${size}</p>
      `;
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
        lobbyOverlay.classList.add("hidden");
        leaveGame.classList.remove("hidden");
        leaveGame.onclick = () => {
            socket.emit("leave room");
            lobbyOverlay.classList.remove("hidden");
            leaveGame.classList.add("hidden");
        };
        readyButton.classList.remove("hidden");
        readyButton.onclick = () => {
            socket.emit("ready");
            readyButton.classList.add("hidden");
        };

        currentGameState = new GameState(user.id);
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
            const msg = handleKeyPress(e.key);
            msg && socket.emit("action", msg);
        };
    });

    socket.on("game states", (gameStates, timeLeft = THREE_MINUTES) => {
        const timeLeftDiv = document.querySelector("#timer");
        const min = Math.floor(timeLeft / 60 / 1000);
        const sec = Math.floor(timeLeft / 1000) % 60;
        const ms = Math.floor(timeLeft / 10) % 100;

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

    socket.on("game end", (gameState) => {
        window.onkeydown = null;
        console.log("Game end", gameState);
        currentGameState.parseGameEndStates(gameState);
    });

    return {
        connect,
        disconnect,
    };
}
export { Connection };
