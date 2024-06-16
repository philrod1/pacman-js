class Point {
  constructor(x, y) {
      this.x = x;
      this.y = y;
  }
}

class GameData {
  constructor(game) {
    this.initFromGame(game);
  }

  initFromGame(game) {
      this.random = game.areGhostsRandom();
      this.blinky = new GhostData(game.ghosts[0].getData(game.ghosts[0].getCruiseLevel()), 0);
      this.pinky = new GhostData(game.ghosts[1].getData(game.getGhostPillCount(1)), 1);
      this.inky = new GhostData(game.ghosts[2].getData(game.getGhostPillCount(2)), 2);
      this.sue = new GhostData(game.ghosts[3].getData(game.getGhostPillCount(3)), 3);

      let pmm = game.pacman.getCurrentMove();
      if (pmm != null) {
          this.pacmanOrientation = 3 - pmm.ordinal();
      } else {
          console.error("GameData pacman move is null");
          this.pacmanOrientation = 0;
      }

      this.pacX = game.pacman.pixel.x;
      this.pacY = game.pacman.pixel.y;
      this.pacmanNormalPattern = game.getPacmanNormalPattern();
      this.pacmanEnergisedPattern = game.getPacmanEnergisedPattern();
      this.energisedFramesRemaining = game.getEnergisedFramesRemaining();
      this.pacmanIsAlive = game.pacman.isAlive();
      this.level = game.getLevel();
      this.mazeId = this.getMazeNumber(this.level - 1);
      this.score = game.getScore();
      this.framesSincePillEaten = game.getFramesSincePillEaten();
      this.globalPillCount = game.getGlobalPillCount();
      this.globalMode = game.isGlobalMode();
      this.pacmanEnenergised = game.pacman.energised;
      this.pillData = game.maze.getPills();
      this.powerPillData = game.maze.getPowerPills();

      this.pillData = [];
      for (let p of pillPositions[this.mazeId]) {
          if (game.maze.getTile(p).getValue() === 1) {
              this.pillData.push(p);
          }
      }

      this.powerPillData = [];
      for (let p of powerPillPositions[this.mazeId]) {
          if (game.maze.getTile(p).getValue() === 2) {
              this.powerPillData.push(p);
          }
      }
  }

  getMazeNumber(level) {
      if (level < 2) return 0;
      if (level < 5) return 1;
      return (((level - 5) / 4) % 2) + 2;
  }

  getPacmanPatterns() {
      return [
          this.pacmanNormalPattern,
          this.pacmanEnergisedPattern
      ];
  }

  getPillData() {
      return [...this.pillData];
  }

  getPowerPillData() {
      return [...this.powerPillData];
  }

  hexString(value) {
      let hex = value.toString(16);
      if (hex.length < 2) {
          hex = '0' + hex;
      }
      return hex;
  }
}
