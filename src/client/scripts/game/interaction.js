export function handleKeyPress(key) {
    switch (key) {
        case "a": // move block to the left
        case "ArrowLeft":
            return { action: "LEFT" };
        case "d": // move block to the right
        case "ArrowRight":
            return { action: "RIGHT" };
        case "q": // rotate block counter clockwise
        case "ArrowUp":
            return { action: "ROTANTI" };
        case "e": // rotate block clockwise
            return { action: "ROT" };
        case "s":
            return { action: "DOWN" };
        case " ":
        case "ArrowDown":
            return { action: "DROP" };
        case "c":
            return { action: "CHEAT" };
        default:
            return null;
    }
}
