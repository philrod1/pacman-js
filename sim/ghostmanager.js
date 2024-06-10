class GhostManager {

  constructor(ghosts) {
      this.ghosts = ghosts;
      this.globalMode = false;
      this.framesSincePillEaten = 0;
      this.globalPillCount = 0;
      this.globalPillLimits = [0, 7, 17, 32];
      this.ghostPillCounts = [0, 0, 0, 0];
      this.random = true;
      this.randomFrames = 300;
  }

  reset(level, pillCount) {
    this.random = true;
    this.randomFrames = 300;
    for (let ghost of this.ghosts) {
        ghost.reset(level, pillCount);
    }
  }

//   reset(globalMode, framesSinceLastPillEaten, globalPillCount, ghostPillCounts, random) {
//       this.random = random;
//       this.globalMode = globalMode;
//       this.framesSincePillEaten = framesSinceLastPillEaten;
//       this.globalPillCount = globalPillCount;
//       for (let i = 1; i < 4; i++) {
//           this.ghostPillCounts[i] = ghostPillCounts[i];
//       }
//   }

  releaseTimeout(level) {
      return level < 5 ? 240 : 180;
  }

  setGlobalMode(globalMode) {
      this.globalMode = globalMode;
  }

  pillEaten() {
      this.framesSincePillEaten = 0;
      if (this.globalMode) {
          this.globalPillCount++;
      } else {
          for (let i = 1; i < 4; i++) {
              if (this.ghosts[i].getState() === 3) {
                  this.ghostPillCounts[i]++;
                  break;
              }
          }
      }
  }

  update(level) {
      if (this.randomFrames <= 0) {
          this.random = false;
      } else {
          this.randomFrames--;
      }
      if (this.globalMode) {
          for (let i = 1; i < 4; i++) {
              if (this.globalPillCount >= this.globalPillLimits[i] && this.ghosts[i].getState() === 3) {
                  this.ghosts[i].leaveHome();
                  if (i === 3) {
                      this.globalPillCount = 0;
                      this.globalMode = false;
                  }
                  return;
              }
          }
      } else {
          for (let i = 1; i < 4; i++) {
              const ghost = this.ghosts[i];
              if (ghost.state === 3 && this.ghostPillCounts[i] >= ghost.getPersonalPillReleaseCount(level)) {
                  ghost.leaveHome();
                  return;
              }
          }
      }
      if (this.framesSincePillEaten > this.releaseTimeout(level)) {
          this.framesSincePillEaten = 0;
          for (let i = 1; i < 4; i++) {
              if (this.ghosts[i].getState() === 3) {
                  this.ghosts[i].leaveHome();
                  break;
              }
          }
      } else {
          this.framesSincePillEaten++;
      }
  }

  syncWithData(gameData) {
      this.framesSincePillEaten = gameData.framesSincePillEaten;
      this.globalPillCount = gameData.globalPillCount;
      this.ghostPillCounts = [0, gameData.pinky.pillCount, gameData.inky.pillCount, gameData.sue.pillCount];
      this.globalMode = gameData.globalMode;
      this.ghosts[0].updatePatterns(gameData.blinky.getPatterns());
      this.ghosts[1].updatePatterns(gameData.pinky.getPatterns());
      this.ghosts[2].updatePatterns(gameData.inky.getPatterns());
      this.ghosts[3].updatePatterns(gameData.sue.getPatterns());
      this.random = gameData.random;
      this.level = gameData.level;
  }

  getPillCount(gid) {
      return this.ghostPillCounts[gid];
  }

  getFramesSincePillEaten() {
      return this.framesSincePillEaten;
  }

  getGlobalPillCount() {
      return this.globalPillCount;
  }

  isGlobalMode() {
      return this.globalMode;
  }

  areGhostsRandom() {
      return this.random;
  }

  incrementChompIndex() {
    for (let ghost of this.ghosts) {
        ghost.chompIndex++;
    }
  }
}
