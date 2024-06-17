class Inky extends Ghost {
	
	constructor() {
		super();
		this.color = "CYAN";
		this.gid = 2;
		this.homeNextState = 2;
		this.homeNextMove = MOVE.LEFT;
		this.startPosition = new Point(112, 124);
		this.pixel = new Point(112, 124);
		this.tile = new Point(this.pixel.x/8, this.pixel.y/8);
		this.previousOrientation = MOVE.UP;
		this.currentOrientation = MOVE.UP;
		this.state = 3;
	}

	copy() {
		const that = new Inky();
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
		this.homeNextMove = MOVE.LEFT;
		this.startPosition = new Point(112, 124);
		this.pixel = new Point(112, 124);
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
	
	getTarget(game) {
		const t = game.pacman.tile;
		if(t == null) {
			return new Point(15, 24);
		}
		switch(game.pacman.getCurrentMove()) {
      case MOVE.UP    : this.target = new Point(t.x-2, t.y-2); break;
      case MOVE.DOWN  : this.target = new Point(t.x,   t.y+2); break;
      case MOVE.LEFT  : this.target = new Point(t.x-2, t.y  ); break;
      case MOVE.RIGHT : this.target = new Point(t.x+2, t.y  ); break;
		}
		const b = game.ghosts[0].tile;
		const dx = this.target.x - b.x;
		const dy = this.target.y - b.y;
		this.target = new Point(this.target.x + dx, this.target.y + dy);
		return this.target;
	}

	getPersonalPillReleaseCount(level) {
		return level == 1 ? 30 : 0;
	}
	
}