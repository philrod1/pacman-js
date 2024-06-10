class GameManager {
  
  constructor(ctx, scale) {
    this.scale = scale;
    this.ctx = ctx;
    this.state = 0;
    this.game = new Game(this.scale);
    this.counter = 100;
    this.updateFunctions = [
      () => { // INITIALISE
        this.state = 1;
      },
      () => { // GET READY
        this.game.drawText("Player One", 9, 14, "cyan");
        this.game.drawText("Ready!", 11, 20, "yellow");
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
        this.game.drawText("Ready!", 11, 20, "yellow");
        this.game.drawAgents(this.ctx, this.scale);
        this.counter--;
        if (this.counter === 0) {
          this.counter = 100;
          this.state = 3; // playing
        }
      },
      () => { // PLAYING
        this.game.step();
        if (this.game.ghostEatenPauseFramesRemaining) {
          this.game.drawGhosts(this.ctx, this.scale);
        } else {
          this.game.drawAgents(this.ctx, this.scale);
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
        // this.game.draw(this.ctx, this.scale);
        this.game.drawAgents(this.ctx, this.scale);
        this.game.drawText("GAME  OVER", 9, 20, "red");
        noLoop();
      },
      () => { // EATEN PART 1
        // All stop, but ghosts keep animating for some time
        if (this.counter > 0) {
          this.counter--;
          this.game.drawAgents(this.ctx, this.scale);
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
          this.game.pacman.draw(this.ctx, this.scale);
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
          this.game.maze.flash(this.scale, flashFrame);
          this.game.drawScore();
          this.game.drawLives();
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
    this.game.draw(this.ctx, this.scale);
    this.updateFunctions[this.state]();
  }
}