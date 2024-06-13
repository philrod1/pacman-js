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
		this.previousOrientation = MOVE.LEFT;
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
