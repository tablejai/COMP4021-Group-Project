import { BORDER_SIZE } from "../../../constants.js";

export class BlockPreview {
    constructor() {
        this.canvas = document.getElementById("preview-blocks");
        this.ctx = this.canvas.getContext("2d");

        this.blocks = [];
        this.cellSize = 20;
    }

    updateBlocks(blocks) {
        this.blocks = blocks;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.font = "16px Geologica, serif";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Next Block:", 10, 15);

        let cumulativeX = 1;
        this.blocks.forEach((block) => {
            this.drawBlock(block, cumulativeX, 2);
            cumulativeX += block.blockShape[0].length + 1;
        });
    }

    drawBlock(block, x, y) {
        this.ctx.lineWidth = BORDER_SIZE;

        for (let row = 0; row < block.blockShape.length; row++) {
            for (let col = 0; col < block.blockShape[row].length; col++) {
                if (block.blockShape[row][col] != null) {
                    let offsetX = x + col;
                    let offsetY = y + row;

                    this.ctx.fillStyle = block.blockShape[row][col];

                    this.ctx.fillRect(
                        this.cellSize * offsetX,
                        this.cellSize * offsetY,
                        this.cellSize - 1,
                        this.cellSize - 1
                    );
                }
            }
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
