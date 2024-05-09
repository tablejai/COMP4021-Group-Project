export function handleKeyPress(e) {
    switch (e.key) {
        case "a": // move block to the left
        case "ArrowLeft":
            e.preventDefault();
            return { action: "LEFT" };
        case "d": // move block to the right
        case "ArrowRight":
            e.preventDefault();
            return { action: "RIGHT" };
        case "q": // rotate block counter clockwise
        case "ArrowUp":
        case "w":
            e.preventDefault();
            return { action: "ROTANTI" };
        case "e": // rotate block clockwise
            e.preventDefault();
            return { action: "ROT" };
        case "s":
            e.preventDefault();
            return { action: "DOWN" };
        case " ":
        case "ArrowDown":
            e.preventDefault();
            return { action: "DROP" };
        case "c":
            e.preventDefault();
            return { action: "CHEAT" };
        default:
            return null;
    }
}
