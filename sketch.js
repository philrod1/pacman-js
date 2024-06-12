let maze_bg;
let decal;

// Load the image.
function preload() {
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
      this.gamemanager.game.pacman.setNextMove(MOVE.LEFT);
      break;
    case 38:
      this.gamemanager.game.pacman.setNextMove(MOVE.UP);
      break;
    case 39:
      this.gamemanager.game.pacman.setNextMove(MOVE.RIGHT);
      break;
    case 40:
      this.gamemanager.game.pacman.setNextMove(MOVE.DOWN);
      break;
      case 48:
        this.gamemanager.game.setLevel(10);
        this.gamemanager.state = 2; // ready part 2
        this.gamemanager.counter = 100;
        this.gamemanager.game.pacman.reset(this.gamemanager.game.level);
        this.gamemanager.game.ghostManager.reset(this.gamemanager.game.level);
        break;
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        this.gamemanager.game.setLevel(event.keyCode-48);
        this.gamemanager.state = 2; // ready part 2
        this.gamemanager.counter = 100;
        this.gamemanager.game.pacman.reset(this.gamemanager.game.level);
        this.gamemanager.game.ghostManager.reset(this.gamemanager.game.level);
        break;
    case 70:
      this.gamemanager.game.fruit.activate(this.gamemanager.game.level);
      break;
    case 83:
      this.gamemanager.counter = 240;
      this.gamemanager.state = 7;
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
  const tx = 61;
  const ty = 66;
  translate(tx * this.gfxScale, ty * this.gfxScale);
  this.gamemanager.update();
  translate(-tx * this.gfxScale, -ty * this.gfxScale);
  // image(decal, -3 + this.gfxScale, -1 * this.gfxScale, decal.width * this.gfxScale / 2, decal.height * this.gfxScale / 2);
}