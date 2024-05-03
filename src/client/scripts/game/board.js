const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");
const gridSize = 30;
const rows = 20;
const cols = 10;

function drawGrid() {
  ctx.strokeStyle = "#888";
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * gridSize;
      const y = row * gridSize;
      ctx.strokeRect(x, y, gridSize, gridSize);
    }
  }
}

drawGrid();