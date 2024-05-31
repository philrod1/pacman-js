let maze_bg;
let decal;

// Load the image.
function preload() {
  maze_bg = loadImage('res/maze1.png');
  decal = loadImage('res/decal.png');
}

function setup() {
  this.gfxScale = 2;
  frameRate(60);
  createCanvas(420 * this.gfxScale, 387*this.gfxScale);
  this.game = new Game();
  this.game.maze.init();
}

let running = true;

function keyPressed(event) {
  switch (event.keyCode) {
    case 32:
      running = !running;
      if (running) {
        loop();
      } else {
        noLoop();
      }
      break;
      case 37:
        game.pacman.setNextMove(MOVE.LEFT);
        break;
      case 38:
        game.pacman.setNextMove(MOVE.UP);
        break;
      case 39:
        game.pacman.setNextMove(MOVE.RIGHT);
        break;
      case 40:
        game.pacman.setNextMove(MOVE.DOWN);
        break;
  }
}

function draw() {
  noSmooth();
  background(0);
  imageMode(CORNER);
  image(maze_bg, 45 * this.gfxScale, 50 * this.gfxScale, maze_bg.width * this.gfxScale, maze_bg.height * this.gfxScale);
  const tx = 61;
  const ty = 66;
  translate(tx * this.gfxScale, ty * this.gfxScale);
  this.game.draw(this.drawingContext, this.gfxScale);
  this.game.step();
  translate(-tx * this.gfxScale, -ty * this.gfxScale);
  translate(54 * this.gfxScale, 50 * this.gfxScale);
  this.game.drawScore(this.drawingContext, this.gfxScale);
  image(decal, -54 * this.gfxScale, -50 * this.gfxScale, decal.width * this.gfxScale / 2, decal.height * this.gfxScale / 2);
}