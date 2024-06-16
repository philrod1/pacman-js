class Blinky extends Ghost {
	
	constructor() {
		super();
		this.color = "RED";
		this.gid = 0;
		this.homeNextState = 5;
		this.homeNextMove = MOVE.UP;
		this.startPosition = new Point(127, 100);
		this.pixel = new Point(127, 100);
		this.tile = new Point(this.pixel.x/8, this.pixel.y/8);
		this.previousOrientation = MOVE.LEFT;
		this.currentOrientation = MOVE.LEFT;
		this.state = 4;
	}

	copy() {
		const that = new Blinky();
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
		that.currentPatterns = this.currentPatterns;
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

	// update(game) {}

	reset(level, pillCount) {
		this.homeNextState = 5;
		this.homeNextMove = MOVE.UP;
		this.startPosition = new Point(127, 100);
		this.pixel = new Point(127, 100);
		this.tile = new Point(this.pixel.x/8, this.pixel.y/8);
		this.previousOrientation = MOVE.LEFT;
		this.currentOrientation = MOVE.LEFT;
		this.state = 4;
		this.frightened = false;
		this.currentPatterns = [
			SPEED_PATTERNS[LEVEL_SPEEDS[2][Math.min(21, level)]],
			SPEED_PATTERNS[LEVEL_SPEEDS[3][Math.min(21, level)]],
			SPEED_PATTERNS[LEVEL_SPEEDS[4][Math.min(21, level)]],
			SPEED_PATTERNS[LEVEL_SPEEDS[5][Math.min(21, level)]],
			SPEED_PATTERNS[LEVEL_SPEEDS[6][Math.min(21, level)]],
    	];
		if (pillCount <= ELROY_DOTS[0][Math.min(21, level)]) {
			this.cruiseLevel = 1;
		} else if (pillCount <= ELROY_DOTS[1][Math.min(21, level)]) {
				this.cruiseLevel = 2;
		}
	}

	leaveHome() {
		this.state = 3;
		this.target = new Point(127,100);
		this.previousOrientation = MOVE.UP;
		this.currentOrientation = MOVE.LEFT;
	}

	getPersonalPillReleaseCount(level) {
		return 0;
	}

	getTarget(game) {
		const t = game.pacman.tile;
		if(t == null) {
			return new Point(15, 24);
		}
		return new Point(t.x, t.y);
	}

	getSteps() {
		if (this.state < 2) {
			return 2;
		}
		let index = 0;
		if (this.frightened) {
			index = 1;
		} else if (this.state != 4 || this.slow) {
			index = 2;
		} else {
			index = this.cruiseLevel > 0 ? this.cruiseLevel+2 : this.cruiseLevel;
		}
		const p = this.currentPatterns[index];
		const val = p & 3;
		this.currentPatterns[index] = (p << 2) | (p >>> 30);
		return STEP_MAP[val];
	}

	getCurrentPattern() {
		console.log("Blinky.getCurrentPattern() dead function");
		let index = 0;
		if (this.frightened) {
			index = 1;
		} else if (this.state != 4 || this.slow) {
			index = 2;
		} else {
			index = this.cruiseLevel > 0 ? this.cruiseLevel+2 : this.cruiseLevel;
		}
		const p = (this.currentPatterns[index] >>> 0).toString(2);
		if(p.length() == 31) {
			return "0" + p;
		}
		if(p.length() == 30) {
			return "00" + p;
		}
		return p;
	}

}
