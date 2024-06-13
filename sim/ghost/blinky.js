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
