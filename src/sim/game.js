class Game {

  static FRAMES_ENERGISED = [0, 360, 300, 240, 180, 120, 300, 120, 120, 60, 300, 120, 60, 60, 180, 60, 60, 0, 60]

  constructor() {
    this.collisionsEnabled = true;
    this.energisedFramesRemaining = 0;
    this.energiserPauseFramesRemaining = 0;
    this.ghostEatenPauseFramesRemaining = 0;
    this.level = 1;
    this.lives = 3;
    this.pacman = new Pacman();
    this.maze = new SimMaze();
    this.fruit = new Fruit();
    this.ghostsEaten = 0;
    this.score = 0;
    this.extraLife = true;
  }

  copy() {
    const that = new Game();
    that.collisionsEnabled = this.collisionsEnabled;
    that.energisedFramesRemaining = this.energisedFramesRemaining;
    that.energiserPauseFramesRemaining = this.energiserPauseFramesRemaining;
    that.ghostEatenPauseFramesRemaining = this.ghostEatenPauseFramesRemaining;
    that.level = this.level;
    that.lives = this.lives;
    that.pacman = this.pacman.copy();
    that.maze = this.maze.copy();
    that.fruit = this.fruit.copy();
    that.ghostsEaten = this.ghostsEaten;
    that.score = this.score;
    that.extraLife = this.extraLife;
    that.ghostManager = this.ghostManager.copy();
    that.ghosts = that.ghostManager.ghosts;
    return that;
  }

  initMaze() {
    this.maze.init();
  }

  incLevel() {
    this.level++;
    this.maze.incLevel();
  }

  setLevel(level) {
    this.level = level;
    this.maze.setLevel(level);
  }

  initGhosts() {
    this.ghosts = [new Blinky(), new Pinky(), new Inky(), new Sue()];
    this.ghostManager = new GhostManager(this.ghosts);
  }

  step() {

    if (this.ghostEatenPauseFramesRemaining > 0) {
      for (let ghost of this.ghosts) {
        if (ghost.state === 0) {
          ghost.update(this);
        }
      }
      this.ghostEatenPauseFramesRemaining--;
      this.fruit.update(this);
      return true;
    }

    if (this.energiserPauseFramesRemaining > 0) {
      this.ghosts.map(ghost => ghost.update(this));
      this.energiserPauseFramesRemaining--;
      return true;
    }
    this.ghostManager.update(this.level);

    if (this.energisedFramesRemaining >= 0) {
      if (this.energisedFramesRemaining < 120) {
        for (let ghost of this.ghosts) {
          ghost.flashing = true;
        }
      }
      if (this.energisedFramesRemaining == 0) {
        this.pacman.setEnergised(false);
        for (let ghost of this.ghosts) {
          ghost.setFrightened(false, this);
          ghost.flashing = false;
        }
      }
      this.energisedFramesRemaining--;
    }

    this.pacman.update(this);

    if (this.checkGhostCollision()) {
      return false;
    }


    for (let ghost of this.ghosts) {
      if (SimMaze.DATA.isSlow(ghost.tile, this.maze.mazeID)) {
        ghost.slow = true;
      } else {
        ghost.slow = false;
      }
      ghost.update(this);
    }

    if (this.checkGhostCollision()) {
      return false;
    }

    this.checkFruitCollision();
    this.fruit.update(this);
    this.checkFruitCollision();

    if (this.maze.pillEaten(this.pacman.tile)) {
      this.pacman.pause(1);
      this.ghostManager.pillEaten();
      this.score += 10;
      if (this.extraLife && this.score >= 10000) {
        this.lives++;
        this.extraLife = false
      }
      const pillCount = this.maze.pillCount;
      if (pillCount === 0) {
        this.fruit.reset();
        return true;
      }
      if (pillCount <= ELROY_DOTS[0][this.level]) {
        this.ghosts[0].cruiseLevel = 1;
      } else if (pillCount <= ELROY_DOTS[1][this.level]) {
        this.ghosts[0].cruiseLevel = 2;
      }
      if (pillCount == 176 || pillCount == 64) {
        this.fruit.activate(this.level);
      }
    }

    if (this.maze.powerPillEaten(this.pacman.tile)) {
      this.ghostsEaten = 0;
      this.pacman.setEnergised(true);
      this.energisedFramesRemaining = this.getEnergisedFrames();
      this.energiserPauseFramesRemaining = 3;
      this.ghosts.map(ghost => {
        ghost.setFrightened(true, this);
      });
      this.ghostManager.pillEaten();
      this.score += 50;
      if (this.extraLife && this.score >= 10000) {
        this.lives++;
        this.extraLife = false
      }
    }

    this.pacman.incFrame();
    for (let ghost of this.ghosts) {
      ghost.incFrame();
    }

    return true;
  }

  getEnergisedFrames() {
    if (this.level < 19) {
      return Game.FRAMES_ENERGISED[this.level];
    }
    return 0;
  }

  checkFruitCollision() {
    if (this.fruit.active) {
      if (this.pacman.tile.equals(this.fruit.tile)) {
        if (!this.fruit.chomped) {
          this.score += this.fruit.getScore();
          this.fruit.chomp();
        }
      }
    }
  }

  checkGhostCollision() {
    if (!this.collisionsEnabled) {
      return;
    }
    for (let ghost of this.ghosts) {
      if (ghost.tile.equals(this.pacman.tile)) {
        if (ghost.state === 4) {
          if (ghost.frightened) {
            ghost.chomp(60);
            this.fruit.pause(60);
            this.ghostEatenPauseFramesRemaining = 60;
            this.ghostsEaten++;
            this.score += 100 * (1 << this.ghostsEaten);
            this.ghostManager.incrementChompIndex();
            return false;
          }
          this.pacman.alive = false;
          this.fruit.reset();
          return this.collisionsEnabled;
        } else {
          return false;
        }
      }
    }
    return false;
  }

  syncToDataPoint(data) {
    this.ghosts[0].setPixelPosition(new Point(data.blinky.px, data.blinky.py));
    this.ghosts[0].setPreviousOrientation(data.blinky.previousOrientation);
    this.ghosts[0].setCurrentOrientation(data.blinky.currentOrientation);
    this.ghosts[0].setState(data.blinky.state);
    this.ghosts[0].setFrightened(data.blinky.frightened, this);
    this.ghosts[0].updatePatterns(data.blinky.getPatterns());
    this.ghosts[0].setCruiseLevel(data.blinky.cruiseLevel);

    this.ghosts[1].setPixelPosition(new Point(data.pinky.px, data.pinky.py));
    this.ghosts[1].setPreviousOrientation(data.pinky.previousOrientation);
    this.ghosts[1].setCurrentOrientation(data.pinky.currentOrientation);
    this.ghosts[1].setState(data.pinky.state);
    this.ghosts[1].setFrightened(data.pinky.frightened, this);
    this.ghosts[1].updatePatterns(data.pinky.getPatterns());

    this.ghosts[2].setPixelPosition(new Point(data.inky.px, data.inky.py));
    this.ghosts[2].setPreviousOrientation(data.inky.previousOrientation);
    this.ghosts[2].setCurrentOrientation(data.inky.currentOrientation);
    this.ghosts[2].setState(data.inky.state);
    this.ghosts[2].setFrightened(data.inky.frightened, this);
    this.ghosts[2].updatePatterns(data.inky.getPatterns());

    this.ghosts[3].setPixelPosition(new Point(data.sue.px, data.sue.py));
    this.ghosts[3].setPreviousOrientation(data.sue.previousOrientation);
    this.ghosts[3].setCurrentOrientation(data.sue.currentOrientation);
    this.ghosts[3].setState(data.sue.state);
    this.ghosts[3].setFrightened(data.sue.frightened, this);
    this.ghosts[3].updatePatterns(data.sue.getPatterns());

    this.pacman.setCurrentMove(data.pacman.currentMove);
    this.pacman.setPixelPosition(new Point(data.pacman.px, data.pacman.py));
    this.pacman.setEnergised(data.pacman.energised);
    this.pacman.updatePatterns(data.pacman.getPatterns());
    this.pacman.setAlive(data.pacman.alive);
    this.energisedFramesRemaining = data.energisedFramesRemaining;
    this.level = data.level;
    //TODO: Remove dependency on RAM
    // this.maze.sync(this.level, data.getRAM());
    // this.ghostManager.sync(this.level, data.getRAM());
    this.score = data.score;
    this.ghostsEaten = data.ghostsEaten;
  }

  toGameData() {
      return new GameData(this);
  }

  advanceToNextDecisionPoint(move, maze) {
    let target = maze.getNextDecisionPoint(this.pacman.tile, move);
    return this.advanceToTarget(target, maze);
  }

  advanceToNextTile(move, maze) {
    let target = maze.getNextTile(this.pacman.tile, move);
    return this.advanceToTarget(target, maze);
  }

  advanceToTarget(target, maze) {
    while (!this.pacman.tile.equals(target)) {
      this.pacman.setTarget(target);
      if (maze.pillCount === 0) {
        return 1;
      }
      if (!this.step()) {
        return -1;
      }
    }
    return 0;
  }

  getMaze() {
    return this.maze;
  }

  areGhostsRandom() {
    return this.ghostManager.areGhostsRandom();
  }

}
