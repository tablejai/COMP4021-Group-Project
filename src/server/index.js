const express = require("express");

const app = express();

const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const io = require("socket.io")(httpServer,
);

io.listen(8000);

io.on("connection", client => {
    client.emit("init", { data: "Yay you came" })
});
