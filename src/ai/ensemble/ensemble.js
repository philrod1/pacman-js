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
    if(game.pacman.energised) {
			return [1,1,1,1];
		}
		const stop = Date.now() + 12;
		const prefs = [0,0,0,0];
    let simGame;
    let dead = false;

    for (const move of SimMaze.DATA.getAvailableMoves(game.pacman.tile, game.maze.mazeID)) {
      dead = false;
      simGame = game.copy();
      simGame.pacman.setNextMove(move);
      let target = SimMaze.DATA.getNextJunctionPoint(simGame.pacman.tile, move, simGame.maze.mazeID);
      while (!simGame.pacman.tile.equals(target)) {
        simGame.pacman.setNextMove(SimMaze.DATA.getMoveTowards(simGame.pacman.tile, target, simGame.maze.mazeID));
        if (!simGame.step()) {
          dead = true;
          break;
        }
      }
      if (dead) {
        // console.log("DEAD", move);
        prefs[move.ordinal] = 0;
      } else {
        prefs[move.ordinal] = this.allPathsAverage(simGame, 0, 4);
      }
      
      // prefs[move.ordinal] = 0;
      // for (let i = 0 ; i < 5 ; i++) {
      //   prefs[move.ordinal] += this.randomWalk(simGame.copy(), 0, 8);
      // }
    }
      
		// for (let i = 0 ; i < 4 ; i++) {
    //   prefs[i] = Math.min(prefs[i], 20);
		// 	prefs[i] /= 20;
		// }
    
		return prefs;
  }

  allPathsAverage(game, depth, maxDepth) {
    if (depth === maxDepth) {
      return depth;
    }
    const mazeID = game.maze.mazeID;
    let value = 0;
    const moves = SimMaze.DATA.getAvailableMoves(game.pacman.tile, mazeID);
    for (let move of moves) {
      let copy = game.copy();
      copy.pacman.setNextMove(move);
      let target = SimMaze.DATA.getNextJunctionPoint(copy.pacman.tile, move, mazeID);
      while (!copy.pacman.tile.equals(target)) {
        copy.pacman.setNextMove(SimMaze.DATA.getMoveTowards(copy.pacman.tile, target, mazeID));
        let result = copy.step();
        if (!result) {
          return depth;
        }
      }
      value += this.allPathsAverage(copy, depth+1, maxDepth);
    }
    return value / (moves.length * maxDepth);
  }

  // randomWalk(game, depth, maxDepth) {
  //   if (depth === maxDepth) {
  //     return depth;
  //   }
  //   const moves = game.maze.getAvailableMoves(game.pacman.tile);
  //   const move = moves[nextInt(moves.length)];
  //   game.pacman.setNextMove(move);
  //   let target = game.maze.getNextDecisionPoint(game.pacman.tile, move);
  //   // console.log(game.pacman.tile, target);
  //   while (!game.pacman.tile.equals(target)) {
  //     let result = game.step();
  //     // console.log(result);
  //     if (!result) {
  //       return 0;
  //     }
  //   }
  //   return this.randomWalk(game, depth+1, maxDepth);
  // }
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
    return [0,0,0,0];
  }
}