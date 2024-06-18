class MazeData {

  static FAKE_JUNTIONS = [
    [new Point(4,2), new Point(11,2), new Point(20,2), new Point(27,2), new Point(3,30), new Point(28,30)],
    [],
    [],
    []
  ]

  static SLOW_TILES = [
    new Set([2, 3, 4, 27, 28, 29].flatMap(x => [9, 18].map(y => new Point(x, y)))),
    new Set([...Array.from({ length: 7 }, (_, i) => new Point(2 + i, 2)),
    ...Array.from({ length: 7 }, (_, i) => new Point(23 + i, 2)),
    ...Array.from({ length: 3 }, (_, i) => new Point(2 + i, 24)),
    ...Array.from({ length: 3 }, (_, i) => new Point(27 + i, 24))])
  ];

  constructor() {
    this.mazes = Array(4).fill(null).map(() => Array(32).fill(null).map(() => Array(32).fill(null)));
    this.buildGraphs();
    this.allDistances = [
      calculateAllDistances(this.mazes[0], 0),
      calculateAllDistances(this.mazes[1], 1),
      calculateAllDistances(this.mazes[2], 2),
      calculateAllDistances(this.mazes[3], 3),
    ];
    // this.initMaze(0);
    // this.initMaze(1);
    // this.initMaze(2);
    // this.initMaze(3);
  }

  setMaze(mazeID) {
    this.mazeID = mazeID;
    this.currentMaze = this.mazes[mazeID];
  }

  // initMaze(mazeID) {
  //   const mazeData = [maze1, maze2, maze3, maze4];
  //   const ram = mazeData[mazeID];
  //   const graph = this.mazes[mazeID];
  //   // for (let x = 0; x < 32; x++) {
  //   //   for (let y = 0; y < 32; y++) {
  //   //     if (ram[x][y] === 0x10 || ram[x][y] === 0x14) {
  //   //       graph[x][y].setValue(ram[x][y]);
  //   //     }
  //   //   }
  //   // }
  // }

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

    for (let x = 0; x < 32; x++) {
      for (let y = 0; y < 32; y++) {
        if (ram[x][y] === 0x40 || ram[x][y] === 0x10 || ram[x][y] === 0x14) {
          graph[x][y] = new Tile(x, y);
          tiles.push(graph[x][y]);
          graph[x][y].setValue(ram[x][y]);
        } else {
          graph[x][y] = null;
        }
      }
    }

    for (const tile of MazeData.FAKE_JUNTIONS[mazeID]) {
      graph[tile.x][tile.y].junction = true;
    }

    for (const tile of tiles) {
      for (const move of MOVES) {
        let dx = move.delta.x;
        let dy = move.delta.y;
        let nx = (tile.x + dx + 32) % 32;
        let ny = (tile.y + dy + 32) % 32;
        let neighbour = graph[nx][ny];
        if (neighbour) {
          tile.setNeighbour(move, neighbour);
        }
      };
      tile.init();
    };
  }

  getNextDecisionPoint(point, currentMove, mazeID) {
		let moves = this.getAvailableMoves(point, mazeID);
		if(!moves.includes(currentMove)) {  // Corner
			moves = moves.filter((m) => m.ordinal !== currentMove.opposite.ordinal);
			currentMove = moves.get(0);
		}
		return this.getNextDecisionTile(point, currentMove, mazeID).position;
	}

  getNextDecisionTile(point, move, mazeID) {
    let curr = this.mazes[mazeID][point.x][point.y].getNeighbour(move);
    while (!curr.decisionPoint) {
      curr = curr.getNeighbour(move);
    }
    return curr;
  }

  getNextJunctionPoint(point, currentMove, mazeID) {
		let moves = this.getAvailableMoves(point, mazeID);
		if(!moves.includes(currentMove)) {  // Corner
			moves = moves.filter((m) => m.ordinal !== currentMove.opposite.ordinal);
			currentMove = moves[0];
		}
		return this.getNextJunctionTile(point, currentMove, mazeID).position;
	}

  getNextJunctionTile(point, move, mazeID) {
    let curr = this.mazes[mazeID][point.x][point.y].getNeighbour(move);
    while (!curr.junction) {
      let next = curr.getNeighbour(move);
      if (!next) {
        move = curr.moves.filter((m) => m.ordinal !== move.opposite.ordinal)[0];
        next = curr.getNeighbour(move);
      }
      curr = next;
    }
    return curr;
  }

  getMoveTowards(tile, target, mazeID) {
    return this.getMoveTowards2(tile, target, MOVES, mazeID);
  }

  getMoveTowards2(tile, target, moves, mazeID) {
    let d = 100000;
    let m = null;
    try {
			const moveDistances = this.getAllDistances(tile, target, mazeID);
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
    return m;
  }

  getAllDistances(p1, p2, mazeID) {
    return this.allDistances[mazeID][(p1.x << 5) + p1.y][(p2.x << 5) + p2.y];
  }

  getNextTile(point, move, mazeID) {
    const tile = this.mazes[mazeID][point.x][point.y];
    if (!tile) {
      return null;
    }
    return tile.getNeighbour(move);
  }

  getAvailableMoves(tile, mazeID) {
		if(tile.x == 32) tile.x = 0;
		try {
			return this.mazes[mazeID][tile.x][tile.y].moves;
		} catch (e) {
      // console.log(e);
			return null;
		}
	}

  isJunction(point, mazeID) {
    if(point.x == 32) point.x = 0;
    let tile = this.mazes[mazeID][point.x][point.y];
    return tile && tile.junction;
  }

  getTile(tile, mazeID) {
    if(point.x == 32) point.x = 0;
    return this.mazes[mazeID][tile.x][tile.y];
  }

  isDecisionTile(point, mazeID) {
		let tile = this.getTile(point, mazeID);
		return tile && tile.decisionPoint;
	}

  isLegal(move, pixel, mazeID) {
    if (!move) {
      return false;
    }
    let tile = this.mazes[mazeID][Math.floor(pixel.x / 8)][Math.floor(pixel.y / 8)];
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

  isSlow(tile, mazeID) {
    if (this.mazeID > 1) {
      return false;
    }
    const slowTiles = MazeData.SLOW_TILES[mazeID];
    for (const slowTile of slowTiles) {
      if (slowTile.equals(tile)) {
        return true;
      }
    }
		return false;
	}

	static isLegalTilePoint(point) {
    if (!point) {
      return false;
    }
		return point.x >=0 
        && point.x < 32 
        && point.y > 1 
        && point.y < 31;
	}

}