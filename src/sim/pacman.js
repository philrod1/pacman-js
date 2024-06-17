class Pacman {

	constructor() {
		this.stepPatterns = [
			SPEED_PATTERNS[LEVEL_SPEEDS[0][1]],
			SPEED_PATTERNS[LEVEL_SPEEDS[1][1]]
		];
		this.color = "YELLOW";
		this.pixel = new Point(127, 196);
		this.tile = new Point(15, 24);
		this.energised = false;
		this.move = MOVE.LEFT;
		this.nextMove = MOVE.LEFT;
		this.frame = 0;
		this.pauseFrames = 0;
		// this.target = new Point(0, 9);
		this.alive = true;
	}

	copy() {
		const that = new Pacman();
		that.stepPatterns = new Array(...this.stepPatterns);
		that.color = this.color;
		that.pixel = new Point(this.pixel.x, this.pixel.y);
		that.tile = new Point(this.tile.x, this.tile.y);
		that.energised = this.energised;
		that.move = this.move;
		that.nextMove = this.nextMove;
		that.frame = this.frame;
		that.pauseFrames = this.pauseFrames;
		// that.target = new Point(this.target.x, this.target.y);
		that.alive = this.alive;
		return that;
	}

	reset(level) {
		this.pixel = new Point(127, 196);
		this.tile = new Point(15, 24);
		this.energised = false;
		this.move = MOVE.LEFT;
		this.nextMove = MOVE.LEFT;
		this.frame = 0;
		this.pauseFrames = 0;
		// this.target = new Point(0, 9);
		this.alive = true;
		this.stepPatterns = [
			SPEED_PATTERNS[LEVEL_SPEEDS[0][Math.min(21, level)]],
			SPEED_PATTERNS[LEVEL_SPEEDS[1][Math.min(21, level)]]
		];
	}

	update(game) {
		if (this.move == null) return;

		if (this.isLegal(this.nextMove, game)) {
			this.setCurrentMove(this.nextMove);
		} else {
      // console.log("Pacman update():", this.nextMove, "is not a legal move.");
			// return;
		}

		if (this.pauseFrames > 0) {
			this.pauseFrames--;
			return;
		}
		const steps = this.getSteps();
		for (let step = 0; step < steps; step++) {

			if (this.isLegal(this.move, game)) {

				// This allows diagonal movement when cornering
				const tpx = this.pixel.x % 8;
				const tpy = this.pixel.y % 8;
				const delta = this.move.delta.copy();
				switch (this.move) {
					case MOVE.UP:
					case MOVE.DOWN:
						if (tpx < 4) {
							delta.translate(1, 0);
						} else if (tpx > 4) {
							delta.translate(-1, 0);
						}
						break;
					default:
						if (tpy < 4) {
							delta.translate(0, 1);
						} else if (tpy > 4) {
							delta.translate(0, -1);
						}
				}
				// Do the move, wrapping if needed
				this.pixel.translate(delta.x, delta.y);
				if (this.pixel.x < 0) {
					this.pixel.x = 255;
				} else if (this.pixel.x > 255) {
					this.pixel.x = 0;
				}
				const newTile = new Point(this.pixel.x / 8, this.pixel.y / 8);
				if (!newTile.equals(this.tile)) {
					this.tile = newTile;
					// 	let moves = game.maze.getAvailableMoves(newTile);
					// 	moves = moves.filter((m) => m.ordinal !== this.move.opposite.ordinal);
					// 	if(!this.tile.equals(this.target)) {
					// 		this.setCurrentMove(game.getMaze().getMoveTowards2(this.tile, this.target, moves));
					// 	}
				}
			}
		}
	}

	isLegal(move, game) {
		return SimMaze.DATA.isLegal(move, this.pixel, game.maze.mazeID);
	}

	setPixelPosition(p) {
		this.pixel = p;
		this.tile = new Point(p.x / 8, p.y / 8);
	}

	pause(frames) {
		this.pauseFrames = frames;
	}

	getSteps() {
		const index = this.energised ? 1 : 0;
		const p = this.stepPatterns[index];
		let val = p & 3;
		this.stepPatterns[index] = (p << 2) | (p >>> 30);
		return STEP_MAP[val];
	}

	setEnergised(isEnergised) {
		this.energised = isEnergised;
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

	isEnergised() {
		return this.energised;
	}

	getNormalStepPattern() {
		return this.stepPatterns[0];
	}

	getEnergisedStepPattern() {
		return this.stepPatterns[1];
	}

	updatePatterns(pacmanPatterns) {
		this.stepPatterns[0] = pacmanPatterns[0];
		this.stepPatterns[1] = pacmanPatterns[1];
	}

	// setTarget(target, game) {
	// 	this.target = target;
	// 	// this.move = game.getMaze().getMoveTowards(this.tile, this.target);
	// 	// if(this.move == null) {
	// 	// 	this.move = MOVE.LEFT;
	// 	// 	this.target = new Point(14, 24);
	// 	// }
	// 	// this.setCurrentMove(move);
	// }

	// getTarget() {
	// 	return this.target;
	// }

	setAlive(alive) {
		this.alive = alive;
	}

	isAlive() {
		return this.alive;
	}

	rotate() {
		let next = 0;
		switch (this.move.ordinal) {
			case 0: next = 3; break;
			case 1: next = 2; break;
			case 2: next = 0; break;
			case 3: next = 1; break;
		}
		this.setCurrentMove(MOVE_BY_ORDINAL[next]);
	}
}