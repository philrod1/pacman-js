class Pinky extends Ghost {
	
	constructor() {
		super();
		this.color = "PINK";
		this.gid = 1;
		this.homeNextState = 3;
		this.homeNextMove = MOVE.UP;
		this.startPosition = new Point(128, 124);
		this.pixel = new Point(128, 124);
		this.tile = new Point(this.pixel.x/8, this.pixel.y/8);
		this.previousOrientation = MOVE.UP;
		this.currentOrientation = MOVE.UP;
		this.state = 3;
	}

	reset(level, pillCount) {
		this.homeNextState = 3;
		this.homeNextMove = MOVE.UP;
		this.startPosition = new Point(128, 124);
		this.pixel = new Point(128, 124);
		this.tile = new Point(this.pixel.x/8, this.pixel.y/8);
		this.previousOrientation = MOVE.UP;
		this.currentOrientation = MOVE.UP;
		this.state = 3;
		this.frightened = false;
		this.currentPatterns = [
			SPEED_PATTERNS[LEVEL_SPEEDS[2][level]],
			SPEED_PATTERNS[LEVEL_SPEEDS[3][level]],
			SPEED_PATTERNS[LEVEL_SPEEDS[4][level]],
			SPEED_PATTERNS[LEVEL_SPEEDS[5][level]],
			SPEED_PATTERNS[LEVEL_SPEEDS[6][level]],
    ];
	}

	getPersonalPillReleaseCount(level) {
		return 0;
	}

	leaveHome() {
		// return
		this.state = 5;
		this.target = this.door;
		this.previousOrientation = MOVE.UP;
	}

	getTarget(game) {
		const t = game.pacman.tile;
		if(t == null) {
			return new Point(15, 24);
		}
		switch(game.pacman.getCurrentMove()) {
      case MOVE.UP    : this.target = new Point(t.x-4, t.y-4); break;
      case MOVE.DOWN  : this.target = new Point(t.x,   t.y+4); break;
      case MOVE.LEFT  : this.target = new Point(t.x-4, t.y  ); break;
      case MOVE.RIGHT : this.target = new Point(t.x+4, t.y  ); break;
		}
		return this.target;
	}

}
