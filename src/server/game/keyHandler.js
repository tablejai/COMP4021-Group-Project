function keyHandler(keyPressed) {
    switch (keyPressed) {
        case "a":
            currentBlock.moveLeft();
            if (!board.canAdd(currentBlock)) {
                currentBlock.moveRight();
            }
            break;
        case "d":
            currentBlock.moveRight();
            if (!board.canAdd(currentBlock)) {
                currentBlock.moveLeft();
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
