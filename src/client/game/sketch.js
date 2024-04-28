function setup() {
    board = new Board(BOARD_WIDTH, BOARD_HEIGHT, false, "MAIN");
    currentBlock = new Block("Z", 100, 100);

    createCanvas(windowWidth, windowHeight);
    BOARD_PLACEMENT.autoCompute();
    showGameOverScreen();
}

var opponentBoards = {};
function draw() {
    board.draw();
    for (var opponentBoard in opponentBoards) {
        opponentBoards[opponentBoard].draw();
    }
    currentBlock.draw();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    BOARD_PLACEMENT.autoCompute();
}


function gameOver(score, timePlayed, players) {
    document.getElementById('score').textContent = 'Score: ' + score;
    document.getElementById('time-played').textContent = 'Time Played: ' + timePlayed;
    var rankingsTable = document.getElementById('rankings');
    // Remove all player rows from previous game
    while (rankingsTable.rows.length > 1) {
        rankingsTable.deleteRow(1);
    }
    // Add a row for each player
    players.forEach(function (player) {
        var row = rankingsTable.insertRow();
        row.insertCell().textContent = player.name;
        row.insertCell().textContent = player.score;
        row.insertCell().textContent = player.timePlayed;
    });
    document.getElementById('game-over').style.display = 'flex';
}

function showGameOverScreen() {
    document.getElementById('game-over').style.display = 'flex';
}