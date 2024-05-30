let img;

// Load the image.
function preload() {
  img = loadImage('res/maze1.png');
}

function setup() {
  frameRate(30);
  createCanvas(800, 800);
  this.game = new Game();
  this.game.maze.init();
}

let running = true;

function keyPressed(event) { // Code to run that uses the event. console.log(event);
  running = !running;
  if (running) {
    loop();
  } else {
    noLoop();
  }
}

function draw() {
  // background(0);

  image(img, 32, 12);
  this.game.draw(this.drawingContext, 2);
  this.game.step();
  // noLoop();
}