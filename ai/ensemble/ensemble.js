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
      for (const risk of this.riskVoices) {
        results = results.map((v, i) => (v + risk.voice.getPreferences(game)[i] * risk.weight));
      }
      const bestMove = this.getBestMove(results, game);
      this.target = this.getNextTarget(game, bestMove);
      // console.log("New target", this.target, "for move", bestMove);
      this.move = bestMove;
    }
    return this.move;
  }

  getBestMove(results, game) {
    const pacman = game.pacman;
    let moves = game.maze.getAvailableMoves(pacman.tile);
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
    return game.maze.getTile(game.pacman.tile).getNeighbour(move);
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

    for (const move of game.maze.getAvailableMoves(game.pacman.tile)) {
      dead = false;
      simGame = game.copy();
      simGame.pacman.setNextMove(move);
      let target = simGame.maze.getNextDecisionPoint(simGame.pacman.tile, move);
      while (!simGame.pacman.tile.equals(target)) {
        if (!simGame.step()) {
          prefs[move.ordinal] = 0;
          dead = true;
          break;
        }
      }
      if (dead) {
        console.log("DEAD", move);
        continue;
      }
      prefs[move.ordinal] = 0; 
      for (let i = 0 ; i < 5 ; i++) {
        prefs[move.ordinal] += this.randomWalk(simGame.copy(), 0, 8);
      }
    }
      
		for (let i = 0 ; i < 4 ; i++) {
      prefs[i] = Math.min(prefs[i], 20);
			prefs[i] /= 20;
		}
    // console.log(prefs);
		return prefs;
  }

  randomWalk(game, depth, maxDepth) {
    if (depth === maxDepth) {
      return depth;
    }
    const moves = game.maze.getAvailableMoves(game.pacman.tile);
    const move = moves[nextInt(moves.length)];
    game.pacman.setNextMove(move);
    let target = game.maze.getNextDecisionPoint(game.pacman.tile, move);
    // console.log(game.pacman.tile, target);
    while (!game.pacman.tile.equals(target)) {
      let result = game.step();
      // console.log(result);
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
      best = Math.min(best, game.maze.getAllDistances(pac, pill)[move.ordinal]);
    }
    return best;
  }
}

class FruitMuncher {
  getPreferences(game) {
		const fruit = game.fruit;
    const pacman = game.pacman.tile;
		if (fruit.active && !fruit.chomped) {
      const results = game.maze.getAllDistances(pacman, fruit.tile).map((x) => 1.0/(x + EnsembleAI.EPSILON));
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