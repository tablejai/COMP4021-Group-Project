import { GameState } from "./game/gameState.js";
import { keyTyped } from "./game/keyTyped.js";

var currentGameState = new GameState();

function Connection(user) {
    const socket = io();

    const connect = () => {
        socket.connect();
    };

    const disconnect = () => {
        socket.disconnect();
    };

    // key
    window.addEventListener('keydown', function(event) {
      keyTyped(socket, event.key);
    });

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
        lobbyOverlay.classList.add("hidden");
        leaveGame.classList.remove("hidden");
        leaveGame.onclick = () => {
            socket.emit("leave room");
            lobbyOverlay.classList.remove("hidden");
            leaveGame.classList.add("hidden");
        };

        // render the p5 gameboard, handle game related handlers in sketch.js
        // Sketch(socket, user, room);
    });

    socket.on("add player", (player) => {
        console.log("Add player", player);
    });

    socket.on("gameState", (gameState) => {
        currentGameState.parseGameState(gameState);
    });

    socket.on("get room playerID", (playerID) => {
        currentGameState.myPlayerID = playerID["playerID"];
    });

    return {
        connect,
        disconnect,
    };
}
window.Connection = Connection;
export { Connection };
// const connection = new window.Connection(user);
// connection.connect();
