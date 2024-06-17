class TestAI {

  constructor() {

  }

  getMove(game) {
    const tile = game.pacman.tile;

    const currentMove = game.pacman.move;

    let availableMoves = game.maze.getAvailableMoves(tile);
    if (availableMoves) {
      availableMoves = availableMoves.filter((m) => m.ordinal !== currentMove.opposite.ordinal);
      let distance = 100000;
      let nextMove = currentMove;
      for (const move of availableMoves) {
        let d = this.distanceToNearestPillPath(tile, move, game) + (nextInt(10000) / 10000000);
        if (d < distance) {
          distance = d;
          nextMove = move;
        }
      }
      return nextMove;
    }
    return currentMove;
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