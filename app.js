const express = require("express")
const session = require("express-session")

const app = express();

app.use(express.static("public"));

app.use(express.json());

const gameSession = session({
    secret: "game",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 300000 }
});

app.use(gameSession);