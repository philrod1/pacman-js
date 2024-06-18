class GameData {

  constructor(game) {
    this.extractGameData(game);
    this.extractPacmanData(game);
    this.extractGhostData(game);
    this.extractMazeData(game);
    this.extractFruitData(game);
  }

  extractGameData(game) {
    this.energisedFramesRemaining =       game.energisedFramesRemaining;
    this.energiserPauseFramesRemaining =  game.energiserPauseFramesRemaining;
    this.ghostEatenPauseFramesRemaining = game.ghostEatenPauseFramesRemaining;
    this.level =                          game.level;
    this.lives =                          game.lives;
    this.ghostsEaten =                    game.ghostsEaten;
    this.score =                          game.score;
    this.extraLife =                      game.extraLife;
  }

  extractPacmanData(game) {
    this.pacmanStepPatterns = [...game.pacman.stepPatterns];
		this.pacmanPixel =            game.pacman.pixel.copy();
		this.pacmanTile =             game.pacman.tile.copy();
		this.pacmanEnergised =        game.pacman.energised;
		this.pacmanMove =             game.pacman.move;
		this.pacmanNextMove =         game.pacman.nextMove;
		this.pacmanFrame =            game.pacman.frame;
		this.pacmanPauseFrames =      game.pacman.pauseFrames;
		this.pacmanTarget =           game.pacman.target ? game.pacman.target.copy() : null;
		this.pacmanAlive =            game.pacman.alive;
  }

  extractGhostData(game) {
    this.globalMode =           game.ghostManager.globalMode;
    this.framesSincePillEaten = game.ghostManager.framesSincePillEaten;
    this.globalPillCount =      game.ghostManager.globalPillCount;
    this.globalPillLimits =     game.ghostManager.globalPillLimits;
    this.ghostPillCounts =  [...game.ghostManager.ghostPillCounts];
    this.random =               game.ghostManager.random;
    this.randomFrames =         game.ghostManager.randomFrames;
    this.ghosts = [];
    for (const [i, ghost] of game.ghostManager.ghosts.entries()) {
      this.ghosts[i] = {
        currentOrientation:  ghost.currentOrientation,
        previousOrientation: ghost.previousOrientation,
        cruiseLevel:         ghost.cruiseLevel,
        frightened:          ghost.frightened,
        wasFrightened:       ghost.wasFrightened,
        flash:               ghost.flash,
        flashing:            ghost.flashing,
        frame:               ghost.frame,
        state:               ghost.state,
        slow:                ghost.slow,
        tileChanged:         ghost.tileChanged,
        reverse:             ghost.reverse,
        currentPatterns: [...ghost.currentPatterns],
        chompIndex:          ghost.chompIndex,
        pixel:               ghost.pixel.copy(),
        tile:                ghost.tile.copy(),
        state:               ghost.state
      }
    }
  }

  extractMazeData(game) {
    this.mazeID =             game.maze.mazeID;
    this.pillCount =          game.maze.pillCount;
    this.pills =      new Map(game.maze.pills);
    this.powerPills = new Map(game.maze.powerPills);
  }

  extractFruitData(game) {
    if (game.fruit.active) {
      this.fruitPixel =               game.fruit.pixel.copy();
      this.fruitTile =                game.fruit.tile.copy();
      this.fruitCurrentOrientation =  game.fruit.currentOrientation;
      this.fruitPreviousOrientation = game.fruit.previousOrientation;
      this.fruitFrame =               game.fruit.frame;
      this.fruitPauseFrames =         game.fruit.pauseFrames;
      this.fruitTarget =              game.fruit.target ?     game.fruit.target.copy() :     null;
      this.fruitNextTarget =          game.fruit.nextTarget ? game.fruit.nextTarget.copy() : null;
      this.fruitPath =            [...game.fruit.path];
      this.fruitFruit =               game.fruit.fruit;
      this.fruitChomped =             game.fruit.chomped;
    }
    this.fruitActive = game.fruit.active;
  }

  restore(game) {
    // GAME
    game.energisedFramesRemaining =       this.energisedFramesRemaining;
    game.energiserPauseFramesRemaining =  this.energiserPauseFramesRemaining;
    game.ghostEatenPauseFramesRemaining = this.ghostEatenPauseFramesRemaining;
    game.level =                          this.level;
    game.lives =                          this.lives;
    game.ghostsEaten =                    this.ghostsEaten;
    game.score =                          this.score;
    game.extraLife =                      this.extraLife;
    // PACMAN
    game.pacman.stepPatterns = [...this.pacmanStepPatterns];
		game.pacman.pixel =            this.pacmanPixel.copy();
		game.pacman.tile =             this.pacmanTile.copy();
		game.pacman.energised =        this.pacmanEnergised;
		game.pacman.move =             this.pacmanMove;
		game.pacman.nextMove =         this.pacmanNextMove;
		game.pacman.frame =            this.pacmanFrame;
		game.pacman.pauseFrames =      this.pacmanPauseFrames;
		game.pacman.target =           this.pacmanTarget ? this.pacmanTarget.copy() : null;
		game.pacman.alive =            this.pacmanAlive;
    // GHOSTS
    game.ghostManager.globalMode =           this.globalMode;
    game.ghostManager.framesSincePillEaten = this.framesSincePillEaten;
    game.ghostManager.globalPillCount =      this.globalPillCount;
    game.ghostManager.globalPillLimits =     this.globalPillLimits;
    game.ghostManager.ghostPillCounts =  [...this.ghostPillCounts];
    game.ghostManager.random =               this.random;
    game.ghostManager.randomFrames =         this.randomFrames;
    for (const [index, ghost] of this.ghosts.entries()) {
      const og = game.ghostManager.ghosts[index];
      og.currentOrientation =  ghost.currentOrientation;
      og.previousOrientation = ghost.previousOrientation;
      og.cruiseLevel =         ghost.cruiseLevel;
      og.frightened =          ghost.frightened;
      og.wasFrightened =       ghost.wasFrightened;
      og.flash =               ghost.flash;
      og.flashing =            ghost.flashing;
      og.frame =               ghost.frame;
      og.state =               ghost.state;
      og.slow =                ghost.slow;
      og.tileChanged =         ghost.tileChanged;
      og.reverse =             ghost.reverse;
      og.currentPatterns = [...ghost.currentPatterns];
      og.chompIndex =          ghost.chompIndex;
      og.pixel =               ghost.pixel.copy();
      og.tile =                ghost.tile.copy();
      og.state =               ghost.state;
    }
    // MAZE
    game.maze.mazeID = this.mazeID;
    game.maze.pillCount = this.pillCount;
    game.maze.pills = new Map(this.pills);
    game.maze.powerPills = new Map(this.powerPills);
    // FRUIT
    if (this.fruitActive) {
      game.fruit.pixel =               this.fruitPixel.copy();
      game.fruit.tile =                this.fruitTile.copy();
      game.fruit.currentOrientation =  this.fruitCurrentOrientation;
      game.fruit.previousOrientation = this.fruitPreviousOrientation;
      game.fruit.frame =               this.fruitFrame;
      game.fruit.pauseFrames =         this.fruitPauseFrames;
      game.fruit.target =              this.fruitTarget ? this.fruitTarget.copy() : null;
      game.fruit.nextTarget =          this.fruitNextTarget ? this.fruitNextTarget.copy() : null;
      game.fruit.path =            [...this.fruitPath];
      game.fruit.fruit =               this.fruitFruit;
      game.fruit.chomped =             this.fruitChomped;
    }
    game.fruit.active = this.fruitActive;
  }

}
