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
  this.gamemanager = new GameManager(drawingContext, this.gfxScale);
}

function incScale() {
  this.setScale(this.gfxScale + 0.1);
}

function decScale() {
  this.setScale(this.gfxScale - 0.1);
}

function setScale(scale) {
  this.gfxScale = scale;
  this.gamemanager.game.setScale(scale);
  resizeCanvas(420 * this.gfxScale, 387*this.gfxScale);
}

let running = true;

function keyPressed(event) {
  // console.log(event.keyCode);
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
      gamemanager.game.pacman.setNextMove(MOVE.LEFT);
      break;
    case 38:
      gamemanager.game.pacman.setNextMove(MOVE.UP);
      break;
    case 39:
      gamemanager.game.pacman.setNextMove(MOVE.RIGHT);
      break;
    case 40:
      gamemanager.game.pacman.setNextMove(MOVE.DOWN);
      break;
    case 187:
      this.incScale();
      break;
    case 189:
      this.decScale();
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
  this.gamemanager.update();
  translate(-tx * this.gfxScale, -ty * this.gfxScale);
  image(decal, -3 + this.gfxScale, -1 * this.gfxScale, decal.width * this.gfxScale / 2, decal.height * this.gfxScale / 2);
}