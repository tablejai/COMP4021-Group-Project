export function keyTyped(socket, key) {
    // TODO: Think if the emitMsg actually be like this
    let emitMsg = null;
    switch (key) {
        case "a": // Pressed a
            emitMsg = { keyPressed: "a" };
            break;
        case "d": // Pressed d
            emitMsg = { keyPressed: "d" };
            break;
        case "q": // Pressed d
            emitMsg = { keyPressed: "q" };
            break;
        case "e": // Pressed d
            emitMsg = { keyPressed: "e" };
            break;
        case "s":
            emitMsg = { keyPressed: "s" };
            break;
        case " ":
            emitMsg = { keyPressed: "spacebar" };
            break;
        default:
            break;
    }

    if (emitMsg != null) {
        socket.emit("keyTyped", JSON.stringify(emitMsg));
    }
}
