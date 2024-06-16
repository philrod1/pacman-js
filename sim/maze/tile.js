class Tile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.neighbours = [null, null, null, null]; // Corresponds to up, left, down, right
    this.blocked = [null, null, null, null];
    this.value = 0; // 0: empty, 1: pill, 2: power pill
    this.ghostHome = false;
    this.junction = false;
    this.corner = false;
    this.decisionPoint = false;
    this.moves = [];
    this.position = new Point(x, y);
    this.centerPoint = new Point(x * 8 + 4, y * 8 + 4);
    // this.spriteRAM = 0x4000 + (31 - x) * 32 + y; // Assuming the same memory mapping as in Java
  }

  copy() {
    const that = new Tile(this.x, this.y);
    that.neighbours = this.neighbours;
    that.blocked = this.blocked;
    that.value = this.value;
    that.ghostHome = this.ghostHome;
    that.junction = this.junction;
    that.decisionPoint = this.decisionPoint;
    that.moves = this.moves;
    return that;
  }

  hasPill() {
    return this.value === 1;
  }

  hasPowerPill() {
    return this.value === 2;
  }

  setHasPill(hasPill) {
    this.value = hasPill ? 1 : 0;
  }

  setHasPowerPill(hasPowerPill) {
    this.value = hasPowerPill ? 2 : 0;
  }

  getNeighbour(move) {
    return this.neighbours[move.ordinal];
  }

  setNeighbour(move, neighbour) {
    this.neighbours[move.ordinal] = neighbour;
  }

  setValue(val) {
    this.value = 0;
    if (val === 0x10) {
      this.value = 1;
      return true;
    }
    if (val === 0x14) {
      this.value = 2;
      return true;
    }
    return false;
  }

  resetValue(value) {
    this.value = value;
  }

  init() {
    for (const move of MOVES) {
      if (this.neighbours[move.ordinal]) {
        this.moves.push(move);
      }
    }
    if (this.moves.length > 2) {
      this.junction = true;
      this.decisionPoint = true;
    } else if (this.moves[0] !== this.moves[1].opposite) {
      this.corner = true;
      this.decisionPoint = true;
    }
  }

  toByte() {
    return this.value;
  }

  toChar() {
    if (this.value === 1) return '\u2219'; // Bullet for pill
    if (this.value === 2) return '\u2022'; // Bullet for power pill
    return ' ';
  }

  equals(that) {
    return this.x == that.x && this.y == that.y;
  }

  toString() {
    return `(${this.x},${this.y})`;
  }

  block(move) {
    if (this.neighbours[move.ordinal]) {
      this.blocked[move.ordinal] = this.neighbours[move.ordinal];
      this.neighbours[move.ordinal] = null;
      return true;
    }
    return false;
  }

  unblock(move) {
    if (this.blocked[move.ordinal]) {
      this.neighbours[move.ordinal] = this.blocked[move.ordinal];
      this.blocked[move.ordinal] = null;
    }
  }

  blockAllExcept(move) {
    const blockedMoves = [];
    for (const move2 of MOVES) {
      if (move2 !== move) {
        if (this.block(move2)) {
          blockedMoves.push(move2);
        }
      }
    }
    return blockedMoves;
  }

  blockAllMoves() {
    for (const move of MOVES) {
      this.block(move);
    }
  }

  unblockAllMoves() {
    for (const move of MOVES) {
      this.unblock(move);
    }
  }

  unblockAll(blockedMoves) {
    if (blockedMoves) {
      for (const move of MOVES) {
        this.unblock(move);
      }
    }
  }
}
