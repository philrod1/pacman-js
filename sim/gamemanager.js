class GameManager {
  
  constructor(ctx, scale) {
    this.scale = scale;
    this.ctx = ctx;
    this.state = 0;
    this.game = new Game(this.scale);
    this.view = new View(this.game, ctx, scale);
    this.ai = new EnsembleAI();
    this.counter = 100;
    this.updateFunctions = [
      () => { // INITIALISE
        this.state = 1;
        // this.game.setLevel(3);
      },
      () => { // GET READY
        this.view.drawText("Player One", 9, 14, "cyan");
        this.view.drawText("Ready!", 11, 20, "yellow");
        this.counter--;
        if (this.counter === 0) {
          this.game.lives--;
          this.counter = 100;
          this.state = 2;  // get ready part 2
          this.game.initGhosts();
        }
      },
      () => { // READY PART 2
        this.game.pacman.alive = true;
        this.view.drawText("Ready!", 11, 20, "yellow");
        this.view.drawAgents();
        this.counter--;
        if (this.counter === 0) {
          this.counter = 100;
          this.state = 3; // playing
        }
      },
      () => { // PLAYING
        const move = this.ai.getMove(this.game);
        this.game.pacman.nextMove = move;
        this.game.step();
        if (this.game.ghostEatenPauseFramesRemaining) {
          this.view.drawGhosts();
        }
        else {
          this.view.drawAgents();
        }
        if (!this.game.pacman.alive) {
          this.counter = 100;
          this.state = 5;  // eaten part 1
        }
        else if (this.game.maze.pillCount === 0) {
          this.counter = 64;
          this.state = 7; // maze complete
        }
      },
      () => { // GAME OVER
        this.game.ghosts = null;
        this.view.drawAgents();
        this.view.drawText("GAME  OVER", 9, 20, "red");
        noLoop();
      },
      () => { // EATEN PART 1
        // All stop, but ghosts keep animating for some time
        if (this.counter > 0) {
          this.counter--;
          this.view.drawAgents();
          for (let ghost of this.game.ghosts) {
            ghost.incFrame();
          }
        } else {
          this.game.pacman.setCurrentMove(MOVE.DOWN);
          this.game.pacman.frame = 5;
          // this.game.ghosts = null;
          this.counter = 87;
          this.state = 6; // eaten part 2
        }

      },
      () => { // EATEN PART 2
        // Ghosts gone, Pacman 10 turns
        if (this.counter > 0) {
          if (this.counter % 8 == 0) {
            this.game.pacman.rotate();
          }
          this.view.drawPacman();
          this.counter--;
        } else if (this.game.lives === 0) {
          this.state = 4;  // game over
        } else {
          this.game.initGhosts();
          this.game.lives--;
          this.state = 2; // ready part 2
          this.counter = 100;
          this.game.pacman.reset(this.game.level);
          this.game.ghostManager.reset(this.game.level, this.game.maze.pillCount);
        }
      },
      () => { // LEVEL COMPLETE
        // Flash the maze four times and increment level
        if (this.counter > 0) {
          const flashFrame = Math.floor(this.counter / 30) % 2;
          this.view.flashMaze(flashFrame);
          this.view.drawScore();
          this.view.drawFooter();
          this.counter--;
        } else {
          this.counter = 100;
          this.game.incLevel();
          this.state = 2; // ready part 2
          this.counter = 100;
          this.game.pacman.reset(this.game.level);
          this.game.ghostManager.reset(this.game.level, this.game.maze.pillCount);
        }
      }
    ];
  }

  update() {
    this.view.drawMaze();
    this.view.drawScore();
    this.view.drawFooter();
    this.updateFunctions[this.state]();
    this.view.drawDecal();
  }
}