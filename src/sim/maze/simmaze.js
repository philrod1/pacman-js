class SimMaze {
  
  static DATA = new MazeData();

  constructor() {
    this.mazeID = 0;
    this.level = 1;
    this.pills = [];
    this.powerPills = [];
    this.pillCount = 0;
  }

  copy() {
    const that = new SimMaze();
    that.mazeID = this.mazeID;
    that.pillCount = this.pillCount;
    that.level = this.level;
    that.pills = [...this.pills];
    that.powerPills = [...this.powerPills];
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
    this.pills = [];
    for (const p of pillPositions[this.mazeID]) {
      this.pills[p.x * 32 + p.y] = true;
    }
    this.powerPills = [];
    for (const p of powerPillPositions[this.mazeID]) {
      this.powerPills[p.x * 32 + p.y] = true;
    }
    this.pillCount = this.pills.flatMap( (v, i) => v ? i : null ).filter( x => x ).length + 4;
    // switch (this.mazeID) {
    //   case 0: this.pillCount = 220; break;
    //   case 1: this.pillCount = 240; break;
    //   case 2: this.pillCount = 238; break;
    //   case 3: this.pillCount = 234; break;
    //   default: this.pillCount = 0;
    // }
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
    const index = pacman.x * 32 + pacman.y;
    if (this.pills[index]) {
      this.pills[index] = false;
      this.pillCount--;
      return true;
    }
    return false;
  }

  powerPillEaten(pacman) {
    const index = pacman.x * 32 + pacman.y;
    if (this.powerPills[index]) {
      this.powerPills[index] = false;
      this.pillCount--;
      return true;
    }
    return false;
  }

  getPills() {
    // const pills = [];
    // for (let [i, v] of this.pills.entries()) {
    //   if (v) {
    //     pills.push(new Point(Math.floor(i/32), i%32));
    //   }
    // }
    // return pills;
    return this.pills.flatMap( (v, i) => v ? i : null ).filter( x => x ).map( p => new Point(Math.floor(p/32), p%32) );
	}

  getPowerPills() {
		return this.powerPills.flatMap( (v, i) => v ? i : null ).filter( x => x ).map( p => new Point(Math.floor(p/32), p%32) );
	}

  getCurrentMazeID() {
		return this.mazeID;
	}

	getPillCount() {
		return this.pillCount;
	}
}