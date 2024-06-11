class Fruit {

	static IN_PATHS = [
		[
			[new Point(0,9), new Point(5,5), new Point(11,12), new Point(20,15)],
			[new Point(30,9), new Point(26,18), new Point(20,15)],
			[new Point(30,18), new Point(23,18)],
			[new Point(0,18), new Point(5,24), new Point(20,24)]
		],
		[
			[new Point(0,2), new Point(20,12)],
			[new Point(30,2), new Point(20,12)],
			[new Point(30,24)],
			[new Point(0,24), new Point(13,21), new Point(18,24)]
		],
		[
			[new Point(0,10), new Point(20,12)],
			[new Point(30,10), new Point(20,12)],
			[new Point(30,10), new Point(28,15)],
			[new Point(0,10), new Point(20,12)]
		],
		[
			[new Point(0,14), new Point(11,6), new Point(20,5)],
			[new Point(30,14)],
			[new Point(30,17), new Point(17,21)],
			[new Point(0,17), new Point(17,24)]
		],
	];

	static OUT_PATHS = [
		[
			[new Point(0,9)],
			[new Point(26,24), new Point(31,9)],
			[new Point(26,24), new Point(31,18)],
			[new Point(14,21), new Point(0,18)]
		],
		[
			[new Point(0,2)],
			[new Point(17,21), new Point(28,13), new Point(31,2)],
			[new Point(31,24)],
			[new Point(13,24), new Point(4,21), new Point(0,24)]
		],
		[
			[new Point(8,24), new Point(0,10)],
			[new Point(23,24), new Point(20,12), new Point(31,10)],
			[new Point(23,24), new Point(28,21), new Point(31,10)],
			[new Point(8,24), new Point(0,10)]
		],
		[
			[new Point(0,14)],
			[new Point(31,14)],
			[new Point(31,17)],
			[new Point(8,20), new Point(0,17)]
		],
	];

	static HOME_PATH = [new Point(17,18), new Point(11,12), new Point(20, 15), new Point(17,18)];

	constructor() {
		this.sprites = loadImage('res/apple.png');
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
	}

	reset(level) {
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
	}

	activate(level) {
		if (this.active) {
			return;
		}
		let maze = 0;  //TODO - Calculate from level
		this.fruit = 0; //TODO - Calculate from level
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

		let steps = this.getSteps();

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
			// this.tile = newTile;
		}
	}

	calculateMove(game, moves, tile, target) {
		let m = this.previousOrientation;
		const t = game.maze.getTile(tile);
		let dist = 10000000;
		for (let move of [MOVE.UP, MOVE.LEFT, MOVE.DOWN, MOVE.RIGHT]) {
			if (moves.includes(move)) {
				let next = t.getNeighbour(move);
				if (next != null) {
					const d = target.distance(next.getPosition());
					if (d < dist) {
						dist = d;
						m = move;
					}
				}
			}
		}
		return m;
	}

	calculateNextMove(game) {
		let moves = [];

		moves = game.maze.getAvailableMoves(this.tile);
		if (moves == null) {
			return this.previousOrientation;
		}

		// moves = moves.filter((m) => m.ordinal !== this.previousOrientation.opposite.ordinal);
		const nextTile = game.maze.getNextTile(this.tile, this.currentOrientation);
		if (game.maze.isDecisionTile(this.tile)) {
			moves = game.maze.getAvailableMoves(this.tile);
			moves = moves.filter((m) => m.ordinal !== this.previousOrientation.opposite.ordinal);
			this.currentOrientation = game.maze.getMoveTowards2(this.tile, this.target, moves);
			// console.log(this.currentOrientation, nextTile, this.nextTarget);
		}

		if (this.isTileCentre(this.pixel) && game.maze.isDecisionTile(this.tile)) {
			this.previousOrientation = this.currentOrientation;
		}

		return this.previousOrientation;

	}

	isDecisionPoint(pixel, tile, maze) {
		if (maze.isLegalTilePoint(tile)) {
			if (maze.isDecisionTile(tile)) {
				switch (this.previousOrientation) {
					case MOVE.UP: return pixel.y % 8 == 4;
					case MOVE.DOWN: return pixel.y % 8 == 4;
					case MOVE.LEFT: return pixel.x % 8 == 4;
					case MOVE.RIGHT: return pixel.x % 8 == 4;
					default: return false;
				}
			}
		} else {
			// console.log(tile + " is not legal.");
		}
		return false;
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

	isLegal(move, game) {
		return game.maze.isLegal(move, this.pixel);
	}

	setPixelPosition(p) {
		this.pixel = p;
		this.tile = new Point(p.x / 8, p.y / 8);
	}

	pause(frames) {
		this.pauseFrames = frames;
	}

	getSteps() {
		const p = this.stepPattern;
		let val = p & 3;
		this.stepPattern = (p << 2) | (p >>> 30);
		return STEP_MAP[val];
	}

	incFrame() {
		this.frame = ++(this.frame) % 16;
	}

	setCurrentMove(move) {
		// console.log("Set current move:", move);
		this.move = move;
		this.setNextMove(move);
	}

	setNextMove(move) {
		this.nextMove = move;
	}

	getCurrentMove() {
		if (this.move == null) {
			this.move = MOVE.LEFT;
		}
		return this.move;
	}

	getTileCentre() {
		return new Point((this.tile.x * 8) + 3, (this.tile.y * 8) + 4);
	}

	setTarget(target, game) {
		this.target = target;
		// this.move = game.getMaze().getMoveTowards(this.tile, this.target);
		// if(this.move == null) {
		// 	this.move = MOVE.LEFT;
		// 	this.target = new Point(14, 24);
		// }
		// this.setCurrentMove(move);
	}

	draw(ctx, scale) {
		if (!this.active) {
			return;
		}
		square(this.target.x * 8 * scale, this.target.y * 8 * scale, 8 * scale);
		const dx = this.pixel.x * scale - 8 * scale;
		const dy = this.pixel.y * scale - 8 * scale;
		const dw = 16 * scale;
		const dh = 16 * scale;
		const sx = 0; // Which fruit?
		const sy = 0;
		const sw = 16;
		const sh = 16;
		image(this.sprites, dx, dy, dw, dh, sx, sy, sw, sh);
	}
}