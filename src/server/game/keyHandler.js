function keyHandler(keyPressed) {
    switch (keyPressed) {
        case "a":
            // Move Left
            currentBlock.moveLeft();
            if (!board.canAdd(currentBlock)) {
                currentBlock.moveRight();
            }
            break;
        case "d":
            // Move Right
            currentBlock.moveRight();
            if (!board.canAdd(currentBlock)) {
                currentBlock.moveLeft();
            }
            break;
        case "q":
            // Rotate Anti-clockwise
            currentBlock.rotateAntiClockwise();
            if (!board.canAdd(currentBlock)) {
                currentBlock.rotateClockwise();
            }
            break;
        case "e":
            // Rotate Clockwise
            currentBlock.rotateClockwise();
            if (!board.canAdd(currentBlock)) {
                currentBlock.rotateAntiClockwise();
            }
            break;
        case "s":
            break;
        default:
            break;
    }
}

module.exports = {
    keyHandler,
};
