class EnsembleAI {

  static EPSILON = 1e-3;

  constructor() {
    this.target = new Point(14,24);
    this.move = MOVE.LEFT;
    this.rewardVoices = [
      {
        voice: new PillMuncher(),
        weight: 0.1
      },
      {
        voice: new FruitMuncher(),
        weight: 1.0
      },
      {
        voice: new GhostChaser(),
        weight: 1.0
      }
    ];
    this.riskVoices = [
      {
        voice: new GhostDodger(),
        weight: 1.0
      }
    ];
  }

  reset() {
    this.target = new Point(14,24);
    this.move = MOVE.LEFT;
  }

  getMove(game) {
    let results = [0,0,0,0];
    if (game.pacman.tile.equals(this.target)) {
      for (const reward of this.rewardVoices) {
        results = results.map((v, i) => (v + reward.voice.getPreferences(game)[i] * reward.weight));
      }
      // console.log("Before:", results);
      for (const risk of this.riskVoices) {
        results = results.map((v, i) => (v * risk.voice.getPreferences(game)[i] * risk.weight));
      }
      // console.log("After :", results);
      const bestMove = this.getBestMove(results, game);
      this.target = this.getNextTarget(game, bestMove);
      this.move = bestMove;
    }
    return this.move;
  }

  getBestMove(results, game) {
    const pacman = game.pacman;
    let moves = SimMaze.DATA.getAvailableMoves(pacman.tile, game.maze.mazeID);
    results[pacman.move.opposite.ordinal] /= 10000;
    // moves = moves.filter((m) => m.ordinal !== pacman.move.opposite.ordinal);
    let bestResult = results[moves[0].ordinal];
    let bestMove = moves[0];
    for (const move of moves) {
      if (results[move.ordinal] > bestResult) {
        bestResult = results[move.ordinal];
        bestMove = move;
      }
    }
    return bestMove;
  }

  getNextTarget(game, move) {
    return SimMaze.DATA.getTile(game.pacman.tile, game.maze.mazeID).getNeighbour(move);
  }

}

class GhostDodger {
  getPreferences(game) {
    // if(game.pacman.energised) {
		// 	return [1,1,1,1];
		// }
		const stop = Date.now() + 12;
		const prefs = [0,0,0,0];
    let simGame;
    let dead = false;
    simGame = game.copy();
    const data = new GameData(game);

    for (const move of SimMaze.DATA.getAvailableMoves(game.pacman.tile, game.maze.mazeID)) {
      dead = false;
      simGame.pacman.setNextMove(move);
      let target = SimMaze.DATA.getNextJunctionPoint(simGame.pacman.tile, move, simGame.maze.mazeID);
      while (!simGame.pacman.tile.equals(target)) {
        simGame.pacman.setNextMove(SimMaze.DATA.getMoveTowards(simGame.pacman.tile, target, simGame.maze.mazeID));
        if (!simGame.step()) {
          dead = true;
          break;
        }
      }
      const data2 = new GameData(simGame);
      if (dead) {
        prefs[move.ordinal] = 0;
      } else {
        // prefs[move.ordinal] = this.allPathsAverage(simGame, 0, 4);
        for (let i = 0 ; i < 10 ; i++) {
          data2.restore(simGame);
          prefs[move.ordinal] += this.randomWalk(simGame, 0, 6);
        }
      }
      data.restore(simGame);
    }

		return prefs;
  }

  allPathsAverage(game, depth, maxDepth) {
    if (depth === maxDepth) {
      return depth;
    }
    const mazeID = game.maze.mazeID;
    let value = 0;
    const data = new GameData(game);
    const moves = SimMaze.DATA.getAvailableMoves(game.pacman.tile, mazeID);
    for (let move of moves) {
      data.restore(game);
      game.pacman.setNextMove(move);
      let target = SimMaze.DATA.getNextJunctionPoint(game.pacman.tile, move, mazeID);
      while (!game.pacman.tile.equals(target)) {
        game.pacman.setNextMove(SimMaze.DATA.getMoveTowards(game.pacman.tile, target, mazeID));
        let result = game.step();
        if (!result) {
          return depth;
        }
      }
      value += this.allPathsAverage(game, depth+1, maxDepth);
    }
    return value / (moves.length * maxDepth);
  }

  randomWalk(game, depth, maxDepth) {
    if (depth === maxDepth) {
      return depth;
    }
    const mazeID = game.maze.mazeID;
    const moves = SimMaze.DATA.getAvailableMoves(game.pacman.tile, mazeID);
    const move = moves[nextInt(moves.length)];
    game.pacman.setNextMove(move);
    let target = SimMaze.DATA.getNextDecisionPoint(game.pacman.tile, move, mazeID);
    while (!game.pacman.tile.equals(target)) {
      let result = game.step();
      if (!result) {
        return 0;
      }
    }
    return this.randomWalk(game, depth+1, maxDepth);
  }
}

class PillMuncher {
  getPreferences(game) {
    const tile = game.pacman.tile;
    const results = [0,0,0,0];
		for (const move of MOVES) {
			const distance = this.distanceToNearestPillPath(tile, move, game) + 1;
			results[move.ordinal] = 1.0 / distance + Math.random() * EnsembleAI.EPSILON;
		}
		return results;
  }
  distanceToNearestPillPath(pac, move, game) {
    let best = 1000000;
    const pills = game.maze.getPills();
    for(const pill of pills) { 
      best = Math.min(best, SimMaze.DATA.getAllDistances(pac, pill, game.maze.mazeID)[move.ordinal]);
    }
    return best;
  }
}

class FruitMuncher {
  getPreferences(game) {
		const fruit = game.fruit;
    const pacman = game.pacman.tile;
		if (fruit.active && !fruit.chomped) {
      const results = SimMaze.DATA.getAllDistances(pacman, fruit.tile, game.maze.mazeID).map((x) => 1.0/(x + EnsembleAI.EPSILON));
      return results;
		}
		return [0,0,0,0];
  }
}

class GhostChaser {
  getPreferences(game) {
    if (!game.pacman.energised) {
      return [0,0,0,0];
    }
    const results = [0,0,0,0];
    const mazeID = game.maze.mazeID;
    const moves = SimMaze.DATA.getAvailableMoves(game.pacman.tile, mazeID);
    for (const ghost of game.ghostManager.ghosts) {
      if (ghost.state == 4 && ghost.frightened) {
        const distances = SimMaze.DATA.getAllDistances(game.pacman.tile, ghost.tile, mazeID);
        for (const move of moves) {
          results[move.ordinal] += 1 / distances[move.ordinal];
        }
      }
    }
    return results;
  }
}