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

	setCruiseLevel(cruiseLevel) {
		this.cruiseLevel = cruiseLevel;
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
		if (this.isFrightened) {
			index = 1;
		} else if (this.state != 4 || this.slow) {
			index = 2;
		} else {
			index = this.cruiseLevel > 0 ? this.cruiseLevel+2 : this.cruiseLevel;
		}
		const p = this.currentPatterns[index];
		const val = p & 3;
		this.currentPatterns[index] = (p << 2) | (p >>> 30);
		// return (val>1) ? val-1 : val;
		return val;
	}
	
	getCruiseLevel() {
		return this.cruiseLevel;
	}

	getCurrentPattern() {
		// console.log("Blinky cruise level: " + this.cruiseLevel);
		let index = 0;
		if (this.isFrightened) {
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
