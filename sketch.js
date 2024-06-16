let maze_bg;
let decal;

// Load the image.
function preload() {
}

function setup() {
  frameRate(60);
  createCanvas(1,1);
  this.gfxScale = 2;
  this.gamemanager = new GameManager(drawingContext, this.gfxScale);
  this.tx = 61;
  this.ty = 66;
}

function incScale() {
  this.gamemanager.incScale();
}

function decScale() {
  this.gamemanager.decScale();
}

// function setScale(scale) {
//   this.gfxScale = scale;
//   this.gamemanager.game.setScale(scale);
//   resizeCanvas(420 * scale, 387 * scale);
// }

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
        this.gamemanager.game.fruit.reset();
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
        this.gamemanager.game.fruit.reset();
        this.gamemanager.game.ghostManager.reset(this.gamemanager.game.level);
        break;
    case 70:
      this.gamemanager.game.fruit.activate(this.gamemanager.game.level);
      break;
    case 83:
      this.gamemanager.counter = 240;
      this.gamemanager.state = 7;
      this.gamemanager.game.fruit.reset();
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
  // background(0);
  imageMode(CORNER);
  translate(tx * this.gamemanager.view.scale, ty * this.gamemanager.view.scale);
  console.time("Update");
  this.gamemanager.update();
  console.timeEnd("Update");
}