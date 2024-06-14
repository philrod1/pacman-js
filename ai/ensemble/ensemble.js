class EnsembleAI {

  static EPSILON = 1e-3;

  constructor() {
    this.target = new Point(14,24);
    this.move = MOVE.LEFT;
    this.rewardVoices = [
      new PillMuncher(),
      new FruitMuncher(),
      new GhostChaser()
    ];
    this.riskVoices = [
      new GhostDodger()
    ];
    this.rewardWeights = [
      0.1,  // Pill Muncher
      0.5,  // Fruit Muncher
      1.0   // Ghost Chaser
    ];
    this.riskWeights = [
      1.0   // Ghost Dodger
    ];
  }

  reset() {
    this.target = new Point(14,24);
    this.move = MOVE.LEFT;
  }

  getMove(game) {
    let results = [0,0,0,0];
    if (game.pacman.tile.equals(this.target)) {
      for (const voice of this.rewardVoices) {
        results = results.map((v, i) => v + voice.getPreferences(game)[i]);
      }
      for (const voice of this.riskVoices) {
        results = results.map((v, i) => v * voice.getPreferences(game)[i]);
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
    moves = moves.filter((m) => m.ordinal !== pacman.move.opposite.ordinal);
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
    return [1,1,1,1];
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
    return [0,0,0,0];
  }
}

class GhostChaser {
  getPreferences(game) {
    return [0,0,0,0];
  }
}