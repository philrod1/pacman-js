class SimMaze {
  
  static WIDTH = 32;
  static HEIGHT = 32;
  static slowTiles = [
    new Set([2, 3, 4, 27, 28, 29].flatMap(x => [9, 18].map(y => new Point(x, y)))),
    new Set([...Array.from({ length: 7 }, (_, i) => new Point(2 + i, 2)),
    ...Array.from({ length: 7 }, (_, i) => new Point(23 + i, 2)),
    ...Array.from({ length: 3 }, (_, i) => new Point(2 + i, 24)),
    ...Array.from({ length: 3 }, (_, i) => new Point(27 + i, 24))])
  ];

  constructor() {
    this.mazes = [];
    this.mazeID = 0;
    this.pillCount = 0;
    this.currentMaze = this.mazes[0];
    this.level = 1;
  }

  copy() {
    const that = new SimMaze();
    that.mazes = this.copyMazes();
    that.mazeID = this.mazeID;
    that.pillCount = this.pillCount;
    that.currentMaze = that.mazes[that.mazeID];
    that.level = this.level;
    that.distances = this.distances;
    return that;
  }

  copyMazes() {
    const copy = [];
    for (let m = 0 ; m < 4 ; m++) {
      copy[m] = [];
      for (let x = 0; x < 32; x++) {
        copy[m][x] = [];
        for (let y = 0; y < 32; y++) {
          copy[m][x][y] = this.mazes[m][x][y] ? this.mazes[m][x][y].copy() : null;
        }
      }
    }
    return copy;
  }

  incLevel() {
    this.setLevel(this.level + 1);
  }

  init() {
    this.mazes = Array(4).fill(null).map(() => Array(SimMaze.WIDTH).fill(null).map(() => Array(SimMaze.HEIGHT).fill(null)));
    this.buildGraphs();
    this.distances = [
      calculateMoveDistances(this.mazes[0], 0),
      calculateMoveDistances(this.mazes[1], 1),
      calculateMoveDistances(this.mazes[2], 2),
      calculateMoveDistances(this.mazes[3], 3),
    ];
    this.setLevel(1);
  }

  sync(data) {
		this.setLevel(data.level);
		this.pillCount = 0;
		for(let pill of data.getPillData()) {
			this.currentMaze[pill.x][pill.y].setValue(0x10);
			this.pillCount++;
		}
		for(let pill of data.getPowerPillData()) {
			this.currentMaze[pill.x][pill.y].setValue(0x14);
			this.pillCount++;
		}
	}

  buildGraphs() {
    const mazeData = [maze1, maze2, maze3, maze4];
    for (let mazeID = 0; mazeID < 4; mazeID++) {
      let ram = mazeData[mazeID];
      this.buildGraph(ram, mazeID);
    }
  }

  buildGraph(ram, mazeID) {
    const graph = this.mazes[mazeID];
    const tiles = [];

    for (let x = 0; x < SimMaze.WIDTH; x++) {
      for (let y = 0; y < SimMaze.HEIGHT; y++) {
        if (ram[x][y] === 0x40 || ram[x][y] === 0x10 || ram[x][y] === 0x14) {
          graph[x][y] = new Tile(x, y);
          tiles.push(graph[x][y]);
          graph[x][y].setValue(ram[x][y]);
        } else {
          graph[x][y] = null;
        }
      }
    }

    for (const tile of tiles) {
      for (const move of MOVES) {
        let dx = move.delta.x;
        let dy = move.delta.y;
        let nx = (tile.x + dx + SimMaze.WIDTH) % SimMaze.WIDTH;
        let ny = (tile.y + dy + SimMaze.HEIGHT) % SimMaze.HEIGHT;
        let neighbour = graph[nx][ny];
        if (neighbour) {
          tile.setNeighbour(move, neighbour);
        }
      };
      tile.init();
    };
  }

  initMaze(mazeID) {
    const mazeData = [maze1, maze2, maze3, maze4];
    const ram = mazeData[mazeID];
    const graph = this.mazes[mazeID];
    for (let x = 0; x < SimMaze.WIDTH; x++) {
      for (let y = 0; y < SimMaze.HEIGHT; y++) {
        if (ram[x][y] === 0x10 || ram[x][y] === 0x14) {
          graph[x][y].setValue(ram[x][y]);
        }
      }
    }
  }

  setLevel(level) {
    this.level = level;
    this.mazeID = SimMaze.getMazeID(level);
    this.currentMaze = this.mazes[this.mazeID];
    this.initMaze(this.mazeID);
    switch (this.mazeID) {
      case 0: this.pillCount = 220; break;
      case 1: this.pillCount = 240; break;
      case 2: this.pillCount = 238; break;
      case 3: this.pillCount = 234; break;
      default: this.pillCount = 0;
    }
  }

  getMaze() {
    return this.currentMaze;
  }

  static getMazeID(level) {
    if (level > 5) {
      return Math.floor(((level - 6) / 4) % 2) + 2;
    } else if (level > 2) {
      return 1;
    }
    return 0;
  }

  toString() {
    return this.currentMaze.map(row => row.map(tile => tile ? tile.toChar() : '░').join('')).join('\n');
  }

  pillEaten(pacman) {
    let tile = this.currentMaze[pacman.x][pacman.y];
    if (tile && tile.hasPill()) {
      tile.setHasPill(false);
      this.pillCount--;
      return true;
    }
    return false;
  }

  powerPillEaten(pacman) {
    let tile = this.currentMaze[pacman.x][pacman.y];
    if (tile && tile.hasPowerPill()) {
      tile.setHasPowerPill(false);
      // this.pillCount--;
      return true;
    }
    return false;
  }

  getAvailableMoves(tile) {
		if(tile.x == 32) tile.x = 0;
		try {
			return this.currentMaze[tile.x][tile.y].moves;
		} catch (e) {
      // console.log(e);
			return null;
		}
	}

  isJunction(point) {
    if(point.x == 32) point.x = 0;
    let tile = this.currentMaze[point.x][point.y];
    console.log(tile);
    return tile && tile.junction;
  }

  getTile(tile) {
    if(point.x == 32) point.x = 0;
    return this.currentMaze[tile.x][tile.y];
  }

  isDecisionTile(point) {
		let tile = this.getTile(point);
		return tile && tile.decisionPoint;
	}

  isLegal(move, pixel) {
    let tile = this.currentMaze[Math.floor(pixel.x / 8)][Math.floor(pixel.y / 8)];
    if (tile == null) return false;
    if (tile.moves.some( m => m.ordinal == move.ordinal )) {
      return true;
    }
    switch (move) {
      case MOVE.UP:
        return pixel.y > tile.centerPoint.y;
      case MOVE.DOWN:
        return pixel.y < tile.centerPoint.y;
      case MOVE.RIGHT:
        return pixel.x < tile.centerPoint.x;
      case MOVE.LEFT:
        return pixel.x > tile.centerPoint.x;
      default:
        return false;
    }
  }

  isSlow(tile) {
    if (this.mazeID > 1) {
      return false;
    }
    const slowTiles = SimMaze.slowTiles[this.mazeID];
    for (const slowTile of slowTiles) {
      if (slowTile.equals(tile)) {
        return true;
      }
    }
		return false;
	}

  getPills() {
		let pills = [];
		for(let p of pillPositions[this.mazeID]) {
			if (this.currentMaze[p.x][p.y].hasPill()) {
				pills.push(new Point(p.x, p.y));
			}
		}
		return pills;
	}

  getPowerPills() {
		let pills = [];
		for(let p of powerPillPositions[mazeID]) {
			if (this.currentMaze[p.x][p.y].hasPowerPill()) {
				pills.push(new Point(p.x, p.y));
			}
		}
		return pills;
	}

  //TODO: This calls out to the "real" maze object.  How can this be fixed?
  getNextDecisionPoint(point, currentMove) {
		let moves = this.getAvailableMoves(point);
		if(!moves.includes(currentMove)) {  // Corner
			moves = moves.filter((m) => m.ordinal !== this.currentMove.opposite.ordinal);
			currentMove = moves.get(0);
		}
		return this.getNextDecisionTile(point, currentMove).position;
	}

  getNextDecisionTile(point, move) {
    let curr = this.currentMaze[point.x][point.y];
    while (!curr.decisionPoint) {
      curr = curr.getNeighbour(move);
    }
    return curr;
  }

  // getMoveTowards(tile, target) {
  //   this.getMoveTowards2(tile, target, [MOVE.UP, MOVE.DOWN, MOVE.LEFT, MOVE.RIGHT]);
  // }

  getMoveTowards2(tile, target, moves) {
    // console.log("getMoveTowards2()", tile, target, moves);
    let d = 100000;
    let m = null;
    try {
			const moveDistances = this.getAllDistances(tile, target);
      for (const move of moves) {
        if (moveDistances[move.ordinal] < d) {
          m = move;
          d = moveDistances[move.ordinal];
        }
      }
		} catch (e) {
			console.log("Null pointer exception (" + tile + " and " + target + ") in maze");
			console.log(e);
			return null;
		}
    // console.log(moves, m);
    return m;
  }

  getAllDistances(p1, p2) {
    return this.distances[this.mazeID][p1.x * HEIGHT + p1.y][p2.x * HEIGHT + p2.y];
  }

  getNextTile(point, move) {
    const tile = this.currentMaze[point.x][point.y];
    if (!tile) {
      return null;
    }
    return tile.getNeighbour(move);
  }

  getCurrentMazeID() {
		return this.mazeID;
	}

	getPillCount() {
		let count = 0;
		const pills = this.pillPositions[mazeID];
		for (let i = 0 ; i < pills.length ; i++) {
			if (getTile(pills[i]).hasPill()) {
        count++;
      }
		}
		const powerPills = this.powerPillPositions[mazeID];
		for (let i = 0 ; i < powerPills.length ; i++) {
			if (getTile(powerPills[i]).hasPowerPill()) {
        count++;
      }
		}
		return count;
	}

	isLegalTilePoint(point) {
    if (!point) {
      return false;
    }
		return point.x >=0 
        && point.x < SimMaze.WIDTH 
        && point.y > 0 
        && point.y < SimMaze.HEIGHT;
	}

}