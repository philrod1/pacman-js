class Fruit {

	static BOUNCE = [-2, -1, -1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, -1, -1];

  static FRUIT_PROBABILITY = [
    0,0,0,0,0,  // Cherry     (5/32)
    1,1,1,1,1,  // Strawberry (5/32)
    2,2,2,2,2,  // Orange     (5/32)
    3,3,3,3,3,  // Pretzel    (5/32)
    4,4,4,4,    // Apple      (4/32)
    5,5,5,5,    // Pear       (4/32)
    6,6,6,6     // Banana     (4/32)
  ];

  static FRUIT_SCORES = [100, 200, 500, 700, 1000, 2000, 5000];

	static IN_PATHS = [
		[
			[new Point(0,9), new Point(5,5), new Point(11,12), new Point(20,15), new Point(17,18)],
			[new Point(30,9), new Point(26,18), new Point(20,15), new Point(17,18)],
			[new Point(30,18), new Point(26,21), new Point(17,18)],
			[new Point(0,18), new Point(5,24), new Point(20,24), new Point(17,18)]
		],
		[
			[new Point(0,2), new Point(20,12), new Point(18,18)],
			[new Point(30,2), new Point(20,12), new Point(18,18)],
			[new Point(30,24), new Point(18,18)],
			[new Point(0,24), new Point(13,21), new Point(18,24), new Point(18,18)]
		],
		[
			[new Point(0,10), new Point(20,12), new Point(18,18)],
			[new Point(30,10), new Point(20,12), new Point(18,18)],
			[new Point(30,10), new Point(28,15), new Point(18,18)],
			[new Point(0,10), new Point(20,12), new Point(18,18)]
		],
		[
			[new Point(0,14), new Point(11,6), new Point(20,13), new Point(17,18)],
			[new Point(30,14), new Point(17,18)],
			[new Point(30,17), new Point(17,21), new Point(17,18)],
			[new Point(0,17), new Point(17,24), new Point(17,18)]
		],
	];

	static OUT_PATHS = [
		[
			[new Point(0,9)],
			[new Point(26,24), new Point(31,9)],
			[new Point(31,18)],
			[new Point(14,21), new Point(0,18)]
		],
		[
			[new Point(0,2)],
			[new Point(18,21), new Point(28,11), new Point(31,2)],
			[new Point(31,24)],
			[new Point(13,24), new Point(5,21), new Point(0,24)]
		],
		[
			[new Point(8,24), new Point(3,21), new Point(0,10)],
			[new Point(23,24), new Point(20,12), new Point(31,10)],
			[new Point(23,24), new Point(28,21), new Point(31,10)],
			[new Point(8,24), new Point(3,21), new Point(0,10)]
		],
		[
			[new Point(0,14)],
			[new Point(23,21), new Point(31,14)],
			[new Point(23,21), new Point(31,17)],
			[new Point(8,20), new Point(0,17)]
		],
	];

	static HOME_PATH = [new Point(11,12), new Point(20, 15), new Point(18,18)];

	constructor() {
		this.pixel = new Point(4, 76);
		this.tile = new Point(0, 9);
		this.currentOrientation = MOVE.UP;
		this.previousOrientation = MOVE.RIGHT;
		this.frame = 0;
		this.pauseFrames = 0;
		this.target = null;
		this.nextTarget = null;
		this.stepPattern = SPEED_PATTERNS[50];
		this.active = false;
		this.path = [];
		this.fruit = 0;
    this.chomped = false;
	}

	reset() {
		this.pixel = new Point(0, 0);
		this.tile = new Point(0, 0);
		this.move = MOVE.LEFT;
		this.nextMove = MOVE.LEFT;
		this.frame = 0;
		this.pauseFrames = 0;
		this.target = new Point(0, 0);
		this.active = false;
		this.path = [];
		this.fruit = 0;
    this.chomped = false;
	}

  getScore() {
    return Fruit.FRUIT_SCORES[this.fruit];
  }

	activate(level) {
		if (this.active) {
			return;
		}
		let maze = SimMaze.getMazeID(level);
		this.fruit = level - 1;
    if (this.fruit > 6) {
      const choice = nextInt(32);
      this.fruit = Fruit.FRUIT_PROBABILITY[choice];
    }
		this.path = [];
		const inPathId = nextInt(4);
		this.path.push(...Fruit.IN_PATHS[maze][inPathId]);
		this.path.push(...Fruit.HOME_PATH);
		this.path.push(...Fruit.OUT_PATHS[maze][nextInt(4)]);
		this.active = true;
		this.tile = this.path.shift();
		this.target = this.path.shift();
		this.pixel = new Point(this.tile.x * 8 + 4, this.tile.y * 8 + 4);
		if (inPathId === 0 || inPathId === 3) {
			this.currentOrientation = MOVE.RIGHT;
		} else {
			this.currentOrientation = MOVE.LEFT;
		}
		this.previousOrientation = this.currentOrientation;
	}

	update(game) {
		if (!this.active) {
			return;
		}
		if (this.pauseFrames > 0) {
			this.pauseFrames--;
      if (this.chomped && this.pauseFrames === 0) {
        this.active = false;
        this.chomped = false;
      }
			return;
		}
		if (this.target.equals(this.tile)) {
			if (this.path.length == 0) {
				this.active = false;
			} else {
				this.target = this.path.shift();
			}
			if (this.isTileCentre(this.pixel)) {
				this.previousOrientation = this.currentOrientation;
			}
		}
		this.frame = (this.frame + 1) % 16;
		const steps = this.getSteps();
		for (let step = 0; step < steps; step++) {

			this.previousOrientation = this.calculateNextMove(game);
			const delta = this.previousOrientation.delta;

			this.pixel.translate(delta.x, delta.y);
			if (this.pixel.x < 0) {
				this.pixel.x = 255;
			} else if (this.pixel.x > 255) {
				this.pixel.x = 0;
			}
			const newTile = new Point(this.pixel.x / 8, this.pixel.y / 8);
			if (!newTile.equals(this.tile)) {
				this.tile = newTile;
				this.tileChanged = true;
			}
		}
	}

	calculateNextMove(game) {
		let moves = game.maze.getAvailableMoves(this.tile);
		if (moves == null) {
			return this.previousOrientation;
		}
		if (game.maze.isDecisionTile(this.tile)) {
			moves = game.maze.getAvailableMoves(this.tile);
			moves = moves.filter((m) => m.ordinal !== this.previousOrientation.opposite.ordinal);
			this.currentOrientation = game.maze.getMoveTowards2(this.tile, this.target, moves);
		}
		if (this.isTileCentre(this.pixel) && game.maze.isDecisionTile(this.tile)) {
			this.previousOrientation = this.currentOrientation;
		}
		return this.previousOrientation;
	}

	isTileCentre(pixel) {
		switch (this.previousOrientation) {
			case MOVE.UP:
			case MOVE.DOWN:
				return pixel.y % 8 == 4;
			case MOVE.LEFT:
			case MOVE.RIGHT:
				return pixel.x % 8 == 4;
			default:
				return false;
		}
	}

	// Called by Game when ghost chomped
	pause(frames) {
		this.pauseFrames = frames;
	}

  chomp() {
    this.chomped = true;
    this.pauseFrames = 60;
  }

	getSteps() {
		const p = this.stepPattern;
		let val = p & 3;
		this.stepPattern = (p << 2) | (p >>> 30);
		return STEP_MAP[val];
	}

}