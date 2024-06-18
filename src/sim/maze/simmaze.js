class SimMaze {
  
  static DATA = new MazeData();
  static PILL_COUNTS = [224, 244, 238, 234];

  constructor() {
    this.mazeID = 0;
    this.level = 1;
    this.pills = null;
    this.powerPills = null;
    this.pillCount = 0;
  }

  copy() {
    const that = new SimMaze();
    that.mazeID = this.mazeID;
    that.pillCount = this.pillCount;
    that.level = this.level;
    that.pills = new Map(this.pills);
    that.powerPills = new Map(this.powerPills);
    return that;
  }

  incLevel() {
    this.setLevel(this.level + 1);
  }

  init() {
    this.setLevel(1);
  }

  setLevel(level) {
    this.level = level;
    this.mazeID = SimMaze.getMazeID(level);
    SimMaze.DATA.setMaze(this.mazeID);
    this.pills = new Map();
    for (const p of pillPositions[this.mazeID]) {
      this.pills.set((p.x << 5) + p.y, true);
    }
    this.powerPills = new Map();
    for (const p of powerPillPositions[this.mazeID]) {
      this.powerPills.set((p.x << 5) + p.y, true);
    }
    this.pillCount = SimMaze.PILL_COUNTS[this.mazeID];
  }

  static getMazeID(level) {
    if (level > 5) {
      return Math.floor(((level - 6) / 4) % 2) + 2;
    } else if (level > 2) {
      return 1;
    }
    return 0;
  }

  pillEaten(pacman) {
    const index = (pacman.x << 5) + pacman.y;
    if (this.pills.has(index)) {
      this.pills.delete(index);
      this.pillCount--;
      return true;
    }
    return false;
  }

  powerPillEaten(pacman) {
    const index = (pacman.x << 5) + pacman.y;
    if (this.powerPills.has(index)) {
      this.powerPills.delete(index);
      this.pillCount--;
      return true;
    }
    return false;
  }

  getPills() {
    return this.pills.keys().map( p => new Point(p >> 5, p & 0x1F) );
	}

  getPowerPills() {
    return this.powerPills.keys().map( p => new Point(p >> 5, p & 0x1F) );
	}

  getCurrentMazeID() {
		return this.mazeID;
	}

	getPillCount() {
		return this.pillCount;
	}
}