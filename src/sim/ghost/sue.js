class Sue extends Ghost {
	
	constructor() {
		super();
		this.color = "ORANGE";
		this.gid = 3;
		this.homeNextState = 2;
		this.homeNextMove = MOVE.RIGHT;
		this.startPosition = new Point(143, 124);
		this.pixel = new Point(143, 124);
		this.tile = new Point(this.pixel.x/8, this.pixel.y/8);
		this.previousOrientation = MOVE.UP;
		this.currentOrientation = MOVE.UP;
		this.state = 3;
	}

	copy() {
		const that = new Sue();
		that.currentOrientation = this.currentOrientation;
		that.previousOrientation = this.previousOrientation;
		that.cruiseLevel = this.cruiseLevel;
		that.frightened = this.frightened;
		that.wasFrightened = this.wasFrightened;
		that.flash = this.flash;
		that.flashing = this.flashing;
		that.frame = this.frame;
		that.state = this.state;
		that.slow = this.slow;
		that.tileChanged = this.tileChanged;
		that.home = this.home;
		that.door = this.door;
		that.homeBottom = this.homeBottom;
		that.homeTop = this.homeTop;
		that.homeLeft = this.homeLeft;
		that.homeRight = this.homeRight;
		that.reverse = this.reverse;
		that.currentPatterns = [...this.currentPatterns];
		that.chompIndex = this.chompIndex;
		that.color = this.color;
		that.gid = this.gid;
		that.homeNextState = this.homeNextState;
		that.homeNextMove = this.homeNextMove;
		that.startPosition = this.startPosition;
		that.pixel = new Point(this.pixel.x, this.pixel.y);
		that.tile = new Point(this.tile.x, this.tile.y);
		that.state = this.state;
		return that;
	}

	reset(level, pillCount) {
		this.homeNextState = 2;
		this.homeNextMove = MOVE.RIGHT;
		this.startPosition = new Point(143, 124);
		this.pixel = new Point(143, 124);
		this.tile = new Point(this.pixel.x/8, this.pixel.y/8);
		this.previousOrientation = MOVE.UP;
		this.currentOrientation = MOVE.UP;
		this.state = 3;
		this.frightened = false;
		this.currentPatterns = [
			SPEED_PATTERNS[LEVEL_SPEEDS[2][Math.min(21, level)]],
			SPEED_PATTERNS[LEVEL_SPEEDS[3][Math.min(21, level)]],
			SPEED_PATTERNS[LEVEL_SPEEDS[4][Math.min(21, level)]],
			SPEED_PATTERNS[LEVEL_SPEEDS[5][Math.min(21, level)]],
			SPEED_PATTERNS[LEVEL_SPEEDS[6][Math.min(21, level)]],
    ];
	}
	
	leaveHome() {
		// return
		this.state = 6;
		this.target = new Point(this.home.x, this.home.y);
		this.previousOrientation = MOVE.RIGHT;
		this.currentOrientation = MOVE.UP;
	}

	getPersonalPillReleaseCount(level) {
		switch (level) {
      case 1:  return 60;
      case 2:  return 50;
      default: return 0;
		}
	}

	getTarget(game) {
		const t = game.pacman.tile;
		if(t == null) {
			return new Point(15, 24);
		}
		let distance = Math.floor(this.tile.distance(t));
		distance *= distance;
		this.target = new Point(2, 33);
		if(distance > 64) {
			this.target = new Point(t.x, t.y);
		}
		return this.target;
	}
	
}
