class Pacman {
	
	constructor() {
    this.stepPatterns = [
			0b10101010101010101010101010101010,
			0b11010101011010101101010101101010
    ];
		this.color = "YELLOW";
    this.pixel = new Point(127,196);
    this.tile = new Point(15,24);
    // this.pixel = new Point(12,19);
    // this.tile = new Point(4,4);
    this.isEnergised = false;
    this.move = MOVE.LEFT;
    this.nextMove = MOVE.LEFT;
    this.frame = 0;
    this.pauseFrames = 0;
    this.target = new Point(1,1);
    this.alive = false;
	}
	
	update(game) {
		if(this.move == null) return;
		
		if(this.isLegal(this.nextMove, game)) {
			this.setCurrentMove(this.nextMove);
		} else {
			return;
		}
		
		if(this.pauseFrames > 0) {
			this.pauseFrames--;
			return;
		}
		const steps = this.getSteps();
		for(let step = 0 ; step < steps ; step++) {
			
			if(this.isLegal(this.move, game)) {
	
				const tpx = this.pixel.x % 8;
				const tpy = this.pixel.y % 8;
	
				const delta = this.move.delta;
				
				switch(this.move) {
					case MOVE.UP:
					case MOVE.DOWN:
						if(tpx < 4) {
							delta.translate(1, 0);
						} else if (tpx > 4) {
							delta.translate(-1, 0);
						}
						break;
					default:
						if(tpy < 4) {
							delta.translate(0, 1);
						} else if (tpy > 4) {
							delta.translate(0, -1);
						}
				}
				this.pixel.translate(delta.x, delta.y);
				if(this.pixel.x < 0) {
					this.pixel.x = 255;
				} else if (this.pixel.x > 255) {
					this.pixel.x = 0;
				}
				const newTile = new Point(this.pixel.x/8, this.pixel.y/8);
				if(!newTile.equals(this.tile)) {
					console.log("New tile");
					this.tile = newTile;
					let moves = game.maze.getAvailableMoves(newTile);
					moves = moves.filter((m) => m.ordinal !== this.move.ordinal);
					// this.setNextMove(MOVE.LEFT);
					if(!this.tile.equals(this.target)) {
						console.log(game.getMaze().getMoveTowards(this.tile, this.target));
						this.setCurrentMove(game.getMaze().getMoveTowards(this.tile, this.target));
					}
				}
			}
		}
	}
	
	isLegal(move, game) {
		return game.maze.isLegal(move, this.pixel);
	}

	setPixelPosition(p) {
		this.pixel = p;
		this.tile = new Point(p.x/8, p.y/8);
	}
	
	pause(frames) {
		this.pauseFrames = frames;
	}
	
	getSteps() {
		const index = this.isEnergised ? 1 : 0;
		const p = this.stepPatterns[index];
		let val = p & 3;
		val = (val>1) ? val-1 : val;
		this.stepPatterns[index] = (p << 2) | (p >>> 30);
		return val;
	}

	setEnergised(isEnergised) {
		this.isEnergised = isEnergised;
	}

	incFrame() {
		this.frame = ++(this.frame) % 16;
	}

	setCurrentMove(move) {
		this.move = move;
		this.setNextMove(move);
	}
	
	// setCurrentMove(pacmanOrientation) {
	// 	switch (pacmanOrientation.ordinal) {
	// 	case 0: this.setCurrentMove(MOVE.RIGHT); break;
	// 	case 1: this.setCurrentMove(MOVE.DOWN);  break;
	// 	case 2: this.setCurrentMove(MOVE.LEFT);  break;
	// 	case 3: this.setCurrentMove(MOVE.UP);    break;
	// 	default: console.log("Pac-Man orientaion is " + pacmanOrientation + "!?");
	// 	}
	// }
	
	setNextMove(move) {
		this.nextMove = move;
	}
	
	getCurrentMove() {
		if(this.move == null) {
			this.move = MOVE.LEFT;
		}
		return this.move;
	}

	getTileCentre() {
		return new Point((this.tile.x*8)+3, (this.tile.y*8)+4);
	}

	isEnergised() {
		return this.isEnergised;
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

	setTarget(target, game) {
		this.target = target;
		move = game.getMaze().getMoveTowards(this.tile, this.target);
		if(move == null) {
			move = MOVE.LEFT;
			this.target = new Point(14, 24);
		}
		this.setCurrentMove(move);
	}

	getTarget() {
		return this.target;
	}
	
	setAlive(alive) {
		this.alive = alive;
	}

	isAlive() {
		return this.alive;
	}

	draw(ctx, scale) {
		ctx.fillStyle = this.color;
    ctx.fillRect(this.pixel.x * scale - 8, this.pixel.y * scale - (4*scale), 8*scale, 8*scale);
	}
}