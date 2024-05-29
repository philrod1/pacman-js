class SimMaze {
  static WIDTH = 32;
  static HEIGHT = 32;
  static slowTiles = [
    new Set([1, 3, 4, 27, 28, 29].flatMap(x => [9, 18].map(y => new Point(x, y)))),
    new Set([...Array.from({ length: 7 }, (_, i) => new Point(2 + i, 2)),
    ...Array.from({ length: 7 }, (_, i) => new Point(23 + i, 2)),
    ...Array.from({ length: 3 }, (_, i) => new Point(2 + i, 24)),
    ...Array.from({ length: 3 }, (_, i) => new Point(27 + i, 24))])
  ];

  constructor() {
    this.mazes = Array(4).fill(null).map(() => Array(SimMaze.WIDTH).fill(null).map(() => Array(SimMaze.HEIGHT).fill(null)));
    this.mazeLists = [[],[],[],[]];
    this.mazeID = 0;
    this.pillCount = 0;
    this.distances = [[],[],[],[]];
    this.currentMaze = this.mazes[0];
  }

  init() {
    this.buildGraphs();
    for (let i = 0 ; i < 4 ; i++) {
      this.distances[i] = floydWarshall(this.mazes[i]);
    }
    this.currentMaze = this.mazes[0];
  }

  sync(data) {
		this.setMaze(data.level);
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
    let graph = this.mazes[mazeID];
    let list = this.mazeLists[mazeID];

    for (let x = 0; x < SimMaze.WIDTH; x++) {
      for (let y = 0; y < SimMaze.HEIGHT; y++) {
        if (ram[x][y] === 0x40 || ram[x][y] === 0x10 || ram[x][y] === 0x14) {
          graph[x][y] = new Tile(x, y);
          list.push(graph[x][y]);
          graph[x][y].setValue(ram[x][y]);
          // if (ram[y][x] === 0x10 || ram[y][x] === 0x14) {
          //   this.pillCount++;
          // }
        } else {
          graph[x][y] = null;
        }
      }
    }

    list.forEach(tile => {
      for (const key in MOVE) {
        let move = MOVE[key];
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
    });
  }

  setMaze(level) {
    this.mazeID = this.getMazeID(level);
    this.currentMaze = this.mazes[this.mazeID];
    switch (this.mazeID) {
      case 0: this.pillCount = 220; break;
      case 1: this.pillCount = 240; break;
      case 2: this.pillCount = 234; break;
      case 3: this.pillCount = 230; break;
      default: this.pillCount = 0;
    }
  }

  getMaze() {
    return this.currentMaze;
  }

  getMazeID(level) {
    if (level > 5) {
      return ((level - 6) / 4 % 2) + 2;
    } else if (level > 2) {
      return 1;
    }
    return 0;
  }

  toString() {
    return this.currentMaze.map(row => row.map(tile => tile ? tile.toChar() : '░').join('')).join('\n');
  }

  pillEaten(msPacmanTile) {
    let tile = this.currentMaze[msPacmanTile.x][msPacmanTile.y];
    if (tile && tile.hasPill()) {
      tile.setHasPill(false);
      this.pillCount--;
      return true;
    }
    return false;
  }

  powerPillEaten(msPacmanTile) {
    let tile = this.currentMaze[msPacmanTile.x][msPacmanTile.y];
    if (tile && tile.hasPowerPill()) {
      tile.setHasPowerPill(false);
      this.pillCount--;
      return true;
    }
    return false;
  }

  getAvailableMoves(point) {
		if(point.x == 32) point.x = 0;
		try {
			let tile = this.currentMaze[point.x][point.y];
			return tile.getAvailableMoves();
		} catch (e) {
      console.log(e);
			return null;
		}
	}

  isJunction(point) {
    if(point.x == 32) point.x = 0;
    let tile = this.currentMaze[point.x][point.y];
    return tile && tile.isJunction();
  }

  getTile(tile) {
    if(point.x == 32) point.x = 0;
    return this.currentMaze[tile.x][tile.y];
  }

  isDecisionTile(point) {
		let tile = this.getTile(point);
		return tile && (tile.isCorner || tile.isJunction);
	}

  isLegal(move, pixel) {
    let tile = this.currentMaze[Math.floor(pixel.x / 8)][Math.floor(pixel.y / 8)];
    if (tile == null) return false;
    let moves = tile.getAvailableMoves();
    if (moves.includes(move)) {
      return true;
    }
    switch (move) {
      case MOVE.UP:
        return pixel.y > tile.getCentrePoint().y;
      case MOVE.DOWN:
        return pixel.y < tile.getCentrePoint().y;
      case MOVE.RIGHT:
        return pixel.x < tile.getCentrePoint().x;
      case MOVE.LEFT:
        return pixel.x > tile.getCentrePoint().x;
      default:
        return false;
    }
  }

  isSlow(tile) {
		return this.mazeID < 2 ? SimMaze.slowTiles[this.mazeID].has(tile) : false;
	}

  getPills() {
		let pills = [];
		for(let p of pillPositions[mazeID]) {
			if (this.currentMaze[p.x][p.y].hasPill()) {
				pills.add(new Point(px, p.y));
			}
		}
		return pills;
	}

  getPowerPills() {
		let pills = [];
		for(let p of powerPillPositions[mazeID]) {
			if (this.currentMaze[p.x][p.y].hasPowerPill()) {
				pills.add(new Point(px, p.y));
			}
		}
		return pills;
	}

  //TODO: This calls out to the "real" maze object.  How can this be fixed?
  getNextDecisionPoint(point, currentMove, maze) {
		// let moves = maze.getAvailableMoves(point);
		// if(!moves.includes(currentMove)) {  // Corner
		// 	moves = moves.filter((m) => m.ordinal !== this.currentMove.opposite.ordinal);
		// 	currentMove = moves.get(0);
		// }
		// return maze.getNextDecisionPoint(point, currentMove);
	}

  //TODO: Make not random
  getMoveTowards(tile, target) {
    return MOVE_BY_ORDINAL[Math.floor(Math.random() * 4)];
  }

  getNextTile(point, move) {
    const tile = this.currentMaze[point.x][point.y];
    // console.log("Get next move:", point, move, tile);
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

  draw(ctx, scale) {
    for(let y = 0 ; y < 32 ; y++) {
      for(let x = 0 ; x < 32 ; x++) {
        let tile = this.currentMaze[x][y];
        if (tile) {
          tile.draw(ctx, scale);
        }
      }
    }
  }

}