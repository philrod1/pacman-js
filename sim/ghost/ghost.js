
class Ghost {

	constructor() {
		this.currentOrientation = MOVE.LEFT;
		this.previousOrientation = MOVE.LEFT;
		this.cruiseLevel = 0;
		this.frightened = false;
		this.wasFrightened = false;
		this.flash = 0;
		this.flashing = false;
		this.frame = 0;
		this.state = 3;
		this.slow = false;
		this.tileChanged = false;
		this.home = new Point(127, 127);
		this.door = new Point(127, 100);
		this.homeBottom = 127;
		this.homeTop = 120;
		this.homeLeft = 111;
		this.homeRight = 143;
		this.reverse = false;
		this.currentPatterns = [
			SPEED_PATTERNS[LEVEL_SPEEDS[2][1]],
			SPEED_PATTERNS[LEVEL_SPEEDS[3][1]],
			SPEED_PATTERNS[LEVEL_SPEEDS[4][1]],
			SPEED_PATTERNS[LEVEL_SPEEDS[5][1]],
			SPEED_PATTERNS[LEVEL_SPEEDS[6][1]],
		];
		this.chompIndex = -1;
	}

	incFrame() {
		this.frame = (this.frame + 1) % 160;
	}

	update(game) {

		if (this.chompPause > 0) {
			this.chompPause--;
			return;
		}

		let steps = this.getSteps();

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
				this.tileChanged = true;
			}
			this.tile = newTile;
		}
	}

	calculateNextMove(game) {
		let moves = [];
		try {
			switch (this.state) {
				case 0: //DEAD
					if (this.pixel.equals(this.door)) {
						this.state = 1;
						this.target = this.home;
						return MOVE.DOWN;
					} else {
						this.target = this.door;
					}
					if (this.tileChanged) {
						moves = game.maze.getAvailableMoves(this.tile);
						moves = moves.filter((m) => m.ordinal !== this.previousOrientation.opposite.ordinal);
						if (moves.length == 1) {
							this.currentOrientation = moves[0];
						} else {
							this.currentOrientation = this.calculateMove(game, moves, this.tile, new Point(this.door.x / 8, this.door.y / 8));
						}
						this.tileChanged = false;
					}
					if (this.isTileCentre(this.pixel)) {
						this.previousOrientation = this.currentOrientation;
					}
					return this.previousOrientation;
				case 1: //Entering Home
					if (this.pixel.y >= this.home.y) {
						this.state = this.homeNextState;
						this.frightened = false;
						this.target = new Point(this.startPosition.x, this.startPosition.y);
						this.currentOrientation = this.homeNextMove;
						return this.homeNextMove;
					} else {
						this.currentOrientation = MOVE.DOWN;
						return MOVE.DOWN;
					}
				case 2: //Move away from exit (Inky and Sue)
					if (this instanceof Inky) {
						if (this.pixel.x <= this.startPosition.x) {
							this.state = 3;
							this.currentOrientation = MOVE.UP;
							return MOVE.UP;
						}
						else {
							this.currentOrientation = MOVE.LEFT;
							return MOVE.LEFT;
						}
					}
					else {
						if (this.pixel.x >= this.startPosition.x) {
							this.state = 3;
							this.currentOrientation = MOVE.UP;
							return MOVE.UP;
						}
						else {
							this.currentOrientation = MOVE.RIGHT;
							return MOVE.RIGHT;
						}
					}
				case 3:  //At home
					if (this.pixel.y >= this.startPosition.y + 4) {
						if (this instanceof Blinky) {
							this.state = 5;
							this.target = game.pacman.tile;
							this.currentOrientation = MOVE.LEFT;
							return MOVE.LEFT;
						}
						this.currentOrientation = MOVE.UP;
						return MOVE.UP;
					} else if (this.pixel.y <= this.startPosition.y - 2) {
						this.currentOrientation = MOVE.DOWN;
						return MOVE.DOWN;
					}
					return this.previousOrientation;
				case 4: //Outside
					if (this.reverse) {
						this.previousOrientation = this.previousOrientation.opposite;
						this.reverse = false;
					} else {
						moves = game.maze.getAvailableMoves(this.tile);
						if (moves == null) {
							return this.previousOrientation;
						}
						if (this.frightened) {
							moves = moves.filter((m) => m.ordinal !== this.previousOrientation.opposite.ordinal);
							this.currentOrientation = moves[nextInt(moves.length)];
						} else {
							moves = moves.filter((m) => m.ordinal !== this.previousOrientation.opposite.ordinal);
							let nextTile = game.maze.getNextTile(this.tile, this.currentOrientation);
							if (!nextTile) {
								nextTile = this.tile;
							}
							if (this.wasFrightened || this.isDecisionPoint(this.pixel, nextTile, game.maze)) {
								this.wasFrightened = false;
								this.target = this.getTarget(game);
								moves = game.maze.getAvailableMoves(nextTile);
								moves = moves.filter((m) => m.ordinal !== this.previousOrientation.opposite.ordinal);
								if (game.areGhostsRandom()) {
									let i = nextInt(moves.length);
									this.currentOrientation = moves[i];
								} else {
									this.currentOrientation = this.calculateMove(game, moves, nextTile, this.target);
								}
							}
						}
						if (this.isTileCentre(this.pixel) && game.maze.isDecisionTile(this.tile)) {
							this.previousOrientation = this.currentOrientation;
						}
					}
					return this.previousOrientation;
				case 5: //Leaving home
					if (this.pixel.y == this.door.y) {
						this.state = 4;
						if (this instanceof Sue) {
							this.target = new Point(20,12);
							this.currentOrientation = MOVE.RIGHT;
							this.previousOrientation = MOVE.RIGHT;
						}
						else {
							this.currentOrientation = MOVE.LEFT;
							this.previousOrientation = MOVE.LEFT;
						}
					}
					else {
						this.currentOrientation = MOVE.UP;
						this.previousOrientation = MOVE.UP;
					}
					return this.previousOrientation;
				case 6: //Move towards exit (Inky and Sue)
					if (this.pixel.x == this.home.x) {
						this.state = 5;
						return MOVE.UP;
					}
					else {
						return this.homeNextMove.opposite;
					}
				default:
					return this.previousOrientation;
			}
		} catch (e) {
			console.log(e);
			return this.previousOrientation;
		}
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

	setFrightened(frightened) {
		this.reverse = frightened;
		this.frightened = frightened;
		this.flashing = false;
		this.flash = 0;
		this.frame = 0;
		if (!frightened) {
			this.wasFrightened = true;
			this.tileChanged = true;
		} else {
			this.chompIndex = -1;
		}
	}

	chomp(pause) {
		this.chompPause = pause;
		this.state = 0;
		this.frightened = false;
		this.tileChanged = true;
		this.target = this.door;
	}

	calculateMove(game, moves, tile, target) {
		let m = this.previousOrientation;
		const t = game.maze.getTile(tile);
		let dist = 10000000;
		for (let move of [MOVE.UP, MOVE.LEFT, MOVE.DOWN, MOVE.RIGHT]) {
			if (moves.includes(move)) {
				let next = t.getNeighbour(move);
				if (next != null) {
					const d = target.distance(next.position);
					if (d < dist) {
						dist = d;
						m = move;
					}
				}
			}
		}
		return m;
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

	getSteps() {
		if (this.state < 2) {
			return 2;
		}
		let index = 0;
		if (this.frightened) {
			index = 1;
		} else if (this.state != 4 || this.slow) {
			index = 2;
		}
		const p = this.currentPatterns[index];
		let val = p & 3;
		this.currentPatterns[index] = (p << 2) | (p >>> 30);
		return STEP_MAP[val];
	}

	getData(pillCount) {
		return [
			this.toTinyData(pillCount),
			this.currentPatterns[0],
			this.currentPatterns[1],
			this.currentPatterns[2],
			this.currentPatterns[3],
			this.currentPatterns[4]
		];
	}

	updatePatterns(patterns) {
		this.currentPatterns = patterns;
	}

	toTinyData(pillCount) {
		let data = this.pixel.x;
		data <<= 8;
		data |= this.pixel.y;
		data <<= 3;
		data |= this.state;
		data <<= 2;
		data |= 3 - this.previousOrientation.ordinal();
		data <<= 2;
		data |= 3 - this.currentOrientation.ordinal();
		data <<= 1;
		data |= this.frightened ? 1 : 0;
		data <<= 8;
		data |= pillCount;
		return data;
	}
}
