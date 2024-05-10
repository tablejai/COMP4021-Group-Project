import { Connection } from "./connection.js";

const authOverlay = document.querySelector("#auth-overlay");
const lobbyOverlay = document.querySelector("#lobby-overlay");
const signInForm = document.querySelector("#signin-form");
const singUpForm = document.querySelector("#signup-form");
const lobbySignOut = document.querySelector("#lobby-signout");
const gameInfoButton = document.querySelector("#game-info-button");

let connection = null;

const signIn = async (username, password) => {
    return await fetch("/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    }).then((res) => res.json());
};

const signUp = async (username, password) => {
    return await fetch("/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    }).then((res) => res.json());
};

const validate = async () => {
    return await fetch("/validate").then((res) => res.json());
};

const signOut = async () => {
    return await fetch("/signout").then((res) => res.json());
};

document.addEventListener("DOMContentLoaded", async () => {
    validate().then((data) => {
        if (data.status === "success") {
            connection = Connection(data.user);
            authOverlay.classList.add("hidden");
        } else {
            console.warn(data.error);
        }
    });
});

signInForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const message = document.querySelector("#signin-message");

    signIn(formData.get("username"), formData.get("password")).then((data) => {
        if (data.status === "success") {
            connection = Connection(data.user);
            authOverlay.classList.add("hidden");
        } else {
            // report error
            message.textContent = data.error;
        }
    });
});

singUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const message = document.querySelector("#signup-message");

    signUp(formData.get("username"), formData.get("password")).then((data) => {
        if (data.status === "success") {
            message.textContent = "Account created successfully";
        } else {
            // report error
            message.textContent = data.error;
        }
    });
});

lobbySignOut.addEventListener("click", () => {
    signOut().then((data) => {
        if (data.status === "success") {
            sessionStorage.removeItem("user");
            authOverlay.classList.remove("hidden");
            lobbyOverlay.classList.add("hidden");
            document.querySelectorAll(".message").forEach((el) => {
                el.textContent = "";
            });
            connection.disconnect();
        }
    });
});

gameInfoButton.addEventListener("click", () => {
    const gameInfo = document.querySelector("#game-info-overlay");
    gameInfo.classList.toggle("hidden");
});

const emojis = ["emoji_1.png", "emoji_2.webp", "emoji_3.png"];
let emojiIdx = 0;
setInterval(() => {
    const emoji = document.querySelector("#emoji");
    emoji.src = `assets/${emojis[emojiIdx++ % emojis.length]}`;
}, 300);
