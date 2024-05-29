class Point {
  constructor(x, y) {
    this.x = Math.floor(x);
    this.y = Math.floor(y);
  }
  translate(dx, dy) {
    this.x += dx;
    this.y += dy;
  }
  distance(that) {
    const dx = that.x - this.x;
    const dy = that.y - this.y;
    return Math.sqrt(dx*dx + dy*dy);
  }
  equals(that) {
    return this.x == that.x && this.y == that.y;
  }
}

/**
 * Enum for moves.
 * @readonly
 * @enum {{name: string, opposite: MOVE, delta: Point, ordinal: int}}
 */
const MOVE = Object.freeze({
  UP:    { name: "UP",    get opposite() { return MOVE.DOWN  }, delta: new Point( 0, -1), ordinal: 0 },
  DOWN:  { name: "DOWN",  get opposite() { return MOVE.UP    }, delta: new Point( 0,  1), ordinal: 1 },
  LEFT:  { name: "LEFT",  get opposite() { return MOVE.RIGHT }, delta: new Point(-1,  0), ordinal: 2 },
  RIGHT: { name: "RIGHT", get opposite() { return MOVE.LEFT  }, delta: new Point( 1,  0), ordinal: 3 }
});

const MOVE_BY_ORDINAL = Object.keys(MOVE).reduce((arr, key) => {
  arr[MOVE[key].ordinal] = MOVE[key];
  return arr;
}, []);

const nextInt = (n) => {
  return Math.floor(Math.random() * n)
}

const powerPillPositions = [
  [new Point(3, 3), new Point(3, 28), new Point(28, 3), new Point(28, 28)],
  [new Point(3, 5), new Point(3, 27), new Point(28, 5), new Point(28, 27)],
  [new Point(3, 4), new Point(3, 24), new Point(28, 4), new Point(28, 24)],
  [new Point(3, 4), new Point(3, 28), new Point(28, 4), new Point(28, 28)]
];

const pillPositions = [
  [new Point(3, 2), new Point(3, 4), new Point(3, 5), new Point(3, 24), new Point(3, 25), 
    new Point(3, 26), new Point(3, 27), new Point(3, 29), new Point(3, 30), new Point(4, 2), 
    new Point(4, 5), new Point(4, 24), new Point(4, 30), new Point(5, 2), new Point(5, 5), 
    new Point(5, 6), new Point(5, 7), new Point(5, 8), new Point(5, 9), new Point(5, 10), 
    new Point(5, 11), new Point(5, 12), new Point(5, 13), new Point(5, 14), new Point(5, 15), 
    new Point(5, 16), new Point(5, 17), new Point(5, 18), new Point(5, 19), new Point(5, 20), 
    new Point(5, 21), new Point(5, 22), new Point(5, 23), new Point(5, 24), new Point(5, 30), 
    new Point(6, 2), new Point(6, 5), new Point(6, 21), new Point(6, 24), new Point(6, 30), 
    new Point(7, 2), new Point(7, 5), new Point(7, 21), new Point(7, 24), new Point(7, 30), 
    new Point(8, 2), new Point(8, 3), new Point(8, 4), new Point(8, 5), new Point(8, 6), 
    new Point(8, 7), new Point(8, 8), new Point(8, 9), new Point(8, 21), new Point(8, 24), 
    new Point(8, 25), new Point(8, 26), new Point(8, 27), new Point(8, 28), new Point(8, 29), 
    new Point(8, 30), new Point(9, 5), new Point(9, 9), new Point(9, 21), new Point(9, 24), 
    new Point(9, 30), new Point(10, 5), new Point(10, 9), new Point(10, 21), new Point(10, 24), 
    new Point(10, 30), new Point(11, 2), new Point(11, 3), new Point(11, 4), new Point(11, 5), 
    new Point(11, 9), new Point(11, 21), new Point(11, 22), new Point(11, 23), new Point(11, 24), 
    new Point(11, 27), new Point(11, 28), new Point(11, 29), new Point(11, 30), new Point(12, 2), 
    new Point(12, 5), new Point(12, 9), new Point(12, 24), new Point(12, 27), new Point(12, 30), 
    new Point(13, 2), new Point(13, 5), new Point(13, 9), new Point(13, 24), new Point(13, 27), 
    new Point(13, 30), new Point(14, 2), new Point(14, 5), new Point(14, 6), new Point(14, 7), 
    new Point(14, 8), new Point(14, 9), new Point(14, 24), new Point(14, 25), new Point(14, 26), 
    new Point(14, 27), new Point(14, 30), new Point(15, 2), new Point(15, 5), new Point(15, 30), 
    new Point(16, 2), new Point(16, 5), new Point(16, 30), new Point(17, 2), new Point(17, 5), 
    new Point(17, 6), new Point(17, 7), new Point(17, 8), new Point(17, 9), new Point(17, 24), 
    new Point(17, 25), new Point(17, 26), new Point(17, 27), new Point(17, 30), new Point(18, 2), 
    new Point(18, 5), new Point(18, 9), new Point(18, 24), new Point(18, 27), new Point(18, 30), 
    new Point(19, 2), new Point(19, 5), new Point(19, 9), new Point(19, 24), new Point(19, 27), 
    new Point(19, 30), new Point(20, 2), new Point(20, 3), new Point(20, 4), new Point(20, 5), 
    new Point(20, 9), new Point(20, 21), new Point(20, 22), new Point(20, 23), new Point(20, 24), 
    new Point(20, 27), new Point(20, 28), new Point(20, 29), new Point(20, 30), new Point(21, 5), 
    new Point(21, 9), new Point(21, 21), new Point(21, 24), new Point(21, 30), new Point(22, 5), 
    new Point(22, 9), new Point(22, 21), new Point(22, 24), new Point(22, 30), new Point(23, 2), 
    new Point(23, 3), new Point(23, 4), new Point(23, 5), new Point(23, 6), new Point(23, 7), 
    new Point(23, 8), new Point(23, 9), new Point(23, 21), new Point(23, 24), new Point(23, 25), 
    new Point(23, 26), new Point(23, 27), new Point(23, 28), new Point(23, 29), new Point(23, 30), 
    new Point(24, 2), new Point(24, 5), new Point(24, 21), new Point(24, 24), new Point(24, 30), 
    new Point(25, 2), new Point(25, 5), new Point(25, 21), new Point(25, 24), new Point(25, 30), 
    new Point(26, 2), new Point(26, 5), new Point(26, 6), new Point(26, 7), new Point(26, 8), 
    new Point(26, 9), new Point(26, 10), new Point(26, 11), new Point(26, 12), new Point(26, 13), 
    new Point(26, 14), new Point(26, 15), new Point(26, 16), new Point(26, 17), new Point(26, 18), 
    new Point(26, 19), new Point(26, 20), new Point(26, 21), new Point(26, 22), new Point(26, 23), 
    new Point(26, 24), new Point(26, 30), new Point(27, 2), new Point(27, 5), new Point(27, 24), 
    new Point(27, 30), new Point(28, 2), new Point(28, 4), new Point(28, 5), new Point(28, 24), 
    new Point(28, 25), new Point(28, 26), new Point(28, 27), new Point(28, 29), new Point(28, 30)],
  [new Point(3, 6), new Point(3, 7), new Point(3, 8), new Point(3, 9), new Point(3, 10), 
    new Point(3, 11), new Point(3, 14), new Point(3, 15), new Point(3, 16), new Point(3, 17), 
    new Point(3, 28), new Point(3, 29), new Point(3, 30), new Point(4, 5), new Point(4, 11), 
    new Point(4, 14), new Point(4, 17), new Point(4, 27), new Point(4, 30), new Point(5, 5), 
    new Point(5, 11), new Point(5, 14), new Point(5, 17), new Point(5, 18), new Point(5, 19), 
    new Point(5, 20), new Point(5, 21), new Point(5, 22), new Point(5, 23), new Point(5, 24), 
    new Point(5, 25), new Point(5, 26), new Point(5, 27), new Point(5, 30), new Point(6, 5), 
    new Point(6, 8), new Point(6, 9), new Point(6, 10), new Point(6, 11), new Point(6, 14), 
    new Point(6, 21), new Point(6, 24), new Point(6, 30), new Point(7, 5), new Point(7, 8), 
    new Point(7, 11), new Point(7, 14), new Point(7, 21), new Point(7, 24), new Point(7, 30), 
    new Point(8, 5), new Point(8, 8), new Point(8, 11), new Point(8, 12), new Point(8, 13),
    new Point(8, 14), new Point(8, 15), new Point(8, 16), new Point(8, 17), new Point(8, 18), 
    new Point(8, 19), new Point(8, 20), new Point(8, 21), new Point(8, 24), new Point(8, 25), 
    new Point(8, 26), new Point(8, 27), new Point(8, 28), new Point(8, 29), new Point(8, 30), 
    new Point(9, 5), new Point(9, 8), new Point(9, 21), new Point(9, 27), new Point(9, 30), 
    new Point(10, 5), new Point(10, 8), new Point(10, 21), new Point(10, 27), new Point(10, 30), 
    new Point(11, 2), new Point(11, 3), new Point(11, 4), new Point(11, 5), new Point(11, 6), 
    new Point(11, 7), new Point(11, 8), new Point(11, 21), new Point(11, 24), new Point(11, 25), 
    new Point(11, 26), new Point(11, 27), new Point(11, 30), new Point(12, 2), new Point(12, 5), 
    new Point(12, 21), new Point(12, 24), new Point(12, 27), new Point(12, 30), new Point(13, 2), 
    new Point(13, 5), new Point(13, 21), new Point(13, 22), new Point(13, 23), new Point(13, 24), 
    new Point(13, 27), new Point(13, 30), new Point(14, 2), new Point(14, 5), new Point(14, 6), 
    new Point(14, 7), new Point(14, 8), new Point(14, 9), new Point(14, 27), new Point(14, 28), 
    new Point(14, 29), new Point(14, 30), new Point(15, 2), new Point(15, 9), new Point(15, 30), 
    new Point(16, 2), new Point(16, 9), new Point(16, 30), new Point(17, 2), new Point(17, 5), 
    new Point(17, 6), new Point(17, 7), new Point(17, 8), new Point(17, 9), new Point(17, 27), 
    new Point(17, 28), new Point(17, 29), new Point(17, 30), new Point(18, 2), new Point(18, 5), 
    new Point(18, 21), new Point(18, 22), new Point(18, 23), new Point(18, 24), new Point(18, 27), 
    new Point(18, 30), new Point(19, 2), new Point(19, 5), new Point(19, 21), new Point(19, 24), 
    new Point(19, 27), new Point(19, 30), new Point(20, 2), new Point(20, 3), new Point(20, 4), 
    new Point(20, 5), new Point(20, 6), new Point(20, 7), new Point(20, 8), new Point(20, 21), 
    new Point(20, 24), new Point(20, 25), new Point(20, 26), new Point(20, 27), new Point(20, 30), 
    new Point(21, 5), new Point(21, 8), new Point(21, 21), new Point(21, 27), new Point(21, 30), 
    new Point(22, 5), new Point(22, 8), new Point(22, 21), new Point(22, 27), new Point(22, 30), 
    new Point(23, 5), new Point(23, 8), new Point(23, 11), new Point(23, 12), new Point(23, 13), 
    new Point(23, 14), new Point(23, 15), new Point(23, 16), new Point(23, 17), new Point(23, 18), 
    new Point(23, 19), new Point(23, 20), new Point(23, 21), new Point(23, 24), new Point(23, 25), 
    new Point(23, 26), new Point(23, 27), new Point(23, 28), new Point(23, 29), new Point(23, 30), 
    new Point(24, 5), new Point(24, 8), new Point(24, 11), new Point(24, 14), new Point(24, 21), 
    new Point(24, 24), new Point(24, 30), new Point(25, 5), new Point(25, 8), new Point(25, 9), 
    new Point(25, 10), new Point(25, 11), new Point(25, 14), new Point(25, 21), new Point(25, 24), 
    new Point(25, 30), new Point(26, 5), new Point(26, 11), new Point(26, 14), new Point(26, 17), 
    new Point(26, 18), new Point(26, 19), new Point(26, 20), new Point(26, 21), new Point(26, 22), 
    new Point(26, 23), new Point(26, 24), new Point(26, 25), new Point(26, 26), new Point(26, 27), 
    new Point(26, 30), new Point(27, 5), new Point(27, 11), new Point(27, 14), new Point(27, 17), 
    new Point(27, 27), new Point(27, 30), new Point(28, 6), new Point(28, 7), new Point(28, 8), 
    new Point(28, 9), new Point(28, 10), new Point(28, 11), new Point(28, 14), new Point(28, 15), 
    new Point(28, 16), new Point(28, 17), new Point(28, 28), new Point(28, 29), new Point(28, 30)],
  [new Point(3, 2), new Point(3, 3), new Point(3, 5), new Point(3, 6), new Point(3, 7), 
    new Point(3, 10), new Point(3, 11), new Point(3, 12), new Point(3, 13), new Point(3, 14), 
    new Point(3, 15), new Point(3, 16), new Point(3, 17), new Point(3, 18), new Point(3, 19), 
    new Point(3, 20), new Point(3, 21), new Point(3, 25), new Point(3, 26), new Point(3, 27), 
    new Point(3, 28), new Point(3, 29), new Point(3, 30), new Point(4, 2), new Point(4, 7), 
    new Point(4, 10), new Point(4, 21), new Point(4, 24), new Point(4, 27), new Point(4, 30), 
    new Point(5, 2), new Point(5, 7), new Point(5, 10), new Point(5, 21), new Point(5, 22), 
    new Point(5, 23), new Point(5, 24), new Point(5, 27), new Point(5, 30), new Point(6, 2), 
    new Point(6, 5), new Point(6, 6), new Point(6, 7), new Point(6, 8), new Point(6, 9), 
    new Point(6, 10), new Point(6, 21), new Point(6, 27), new Point(6, 30), new Point(7, 2), 
    new Point(7, 5), new Point(7, 21), new Point(7, 27), new Point(7, 30), new Point(8, 2), 
    new Point(8, 5), new Point(8, 21), new Point(8, 22), new Point(8, 23), new Point(8, 24), 
    new Point(8, 25), new Point(8, 26), new Point(8, 27), new Point(8, 28), new Point(8, 29), 
    new Point(8, 30), new Point(9, 2), new Point(9, 5), new Point(9, 6), new Point(9, 7), 
    new Point(9, 8), new Point(9, 9), new Point(9, 24), new Point(10, 2), new Point(10, 5), 
    new Point(10, 9), new Point(10, 24), new Point(11, 2), new Point(11, 3), new Point(11, 4), 
    new Point(11, 5), new Point(11, 9), new Point(11, 21), new Point(11, 22), new Point(11, 23), 
    new Point(11, 24), new Point(11, 27), new Point(11, 28), new Point(11, 29), new Point(11, 30), 
    new Point(12, 5), new Point(12, 9), new Point(12, 21), new Point(12, 24), new Point(12, 27), 
    new Point(12, 30), new Point(13, 5), new Point(13, 9), new Point(13, 21), new Point(13, 24), 
    new Point(13, 27), new Point(13, 30), new Point(14, 2), new Point(14, 3), new Point(14, 4), 
    new Point(14, 5), new Point(14, 6), new Point(14, 7), new Point(14, 8), new Point(14, 9), 
    new Point(14, 21), new Point(14, 24), new Point(14, 25), new Point(14, 26), new Point(14, 27), 
    new Point(14, 30), new Point(15, 2), new Point(15, 9), new Point(15, 30), new Point(16, 2), 
    new Point(16, 9), new Point(16, 30), new Point(17, 2), new Point(17, 3), new Point(17, 4), 
    new Point(17, 5), new Point(17, 6), new Point(17, 7), new Point(17, 8), new Point(17, 9), 
    new Point(17, 21), new Point(17, 24), new Point(17, 25), new Point(17, 26), new Point(17, 27), 
    new Point(17, 30), new Point(18, 5), new Point(18, 9), new Point(18, 21), new Point(18, 24), 
    new Point(18, 27), new Point(18, 30), new Point(19, 5), new Point(19, 9), new Point(19, 21), 
    new Point(19, 24), new Point(19, 27), new Point(19, 30), new Point(20, 2), new Point(20, 3), 
    new Point(20, 4), new Point(20, 5), new Point(20, 9), new Point(20, 21), new Point(20, 22), 
    new Point(20, 23), new Point(20, 24), new Point(20, 27), new Point(20, 28), new Point(20, 29), 
    new Point(20, 30), new Point(21, 2), new Point(21, 5), new Point(21, 9), new Point(21, 24), 
    new Point(22, 2), new Point(22, 5), new Point(22, 6), new Point(22, 7), new Point(22, 8), 
    new Point(22, 9), new Point(22, 24), new Point(23, 2), new Point(23, 5), new Point(23, 21), 
    new Point(23, 22), new Point(23, 23), new Point(23, 24), new Point(23, 25), new Point(23, 26), 
    new Point(23, 27), new Point(23, 28), new Point(23, 29), new Point(23, 30), new Point(24, 2), 
    new Point(24, 5), new Point(24, 21), new Point(24, 27), new Point(24, 30), new Point(25, 2), 
    new Point(25, 5), new Point(25, 6), new Point(25, 7), new Point(25, 8), new Point(25, 9), 
    new Point(25, 10), new Point(25, 21), new Point(25, 27), new Point(25, 30), new Point(26, 2), 
    new Point(26, 7), new Point(26, 10), new Point(26, 21), new Point(26, 22), new Point(26, 23), 
    new Point(26, 24), new Point(26, 27), new Point(26, 30), new Point(27, 2), new Point(27, 7), 
    new Point(27, 10), new Point(27, 21), new Point(27, 24), new Point(27, 27), new Point(27, 30), 
    new Point(28, 2), new Point(28, 3), new Point(28, 5), new Point(28, 6), new Point(28, 7), 
    new Point(28, 10), new Point(28, 11), new Point(28, 12), new Point(28, 13), new Point(28, 14), 
    new Point(28, 15), new Point(28, 16), new Point(28, 17), new Point(28, 18), new Point(28, 19), 
    new Point(28, 20), new Point(28, 21), new Point(28, 25), new Point(28, 26), new Point(28, 27), 
    new Point(28, 28), new Point(28, 29), new Point(28, 30)],
  [new Point(3, 2), new Point(3, 3), new Point(3, 5), new Point(3, 6), new Point(3, 7), 
    new Point(3, 8), new Point(3, 9), new Point(3, 24), new Point(3, 25), new Point(3, 26), 
    new Point(3, 27), new Point(3, 29), new Point(3, 30), new Point(4, 2), new Point(4, 9), 
    new Point(4, 24), new Point(4, 30), new Point(5, 2), new Point(5, 9), new Point(5, 10), 
    new Point(5, 11), new Point(5, 12), new Point(5, 19), new Point(5, 20), new Point(5, 21), 
    new Point(5, 22), new Point(5, 23), new Point(5, 24), new Point(5, 30), new Point(6, 2), 
    new Point(6, 3), new Point(6, 4), new Point(6, 5), new Point(6, 6), new Point(6, 9), 
    new Point(6, 12), new Point(6, 19), new Point(6, 24), new Point(6, 27), new Point(6, 28), 
    new Point(6, 29), new Point(6, 30), new Point(7, 2), new Point(7, 6), new Point(7, 9), 
    new Point(7, 12), new Point(7, 19), new Point(7, 24), new Point(7, 27), new Point(7, 30), 
    new Point(8, 2), new Point(8, 6), new Point(8, 7), new Point(8, 8), new Point(8, 9), 
    new Point(8, 12), new Point(8, 13), new Point(8, 14), new Point(8, 15), new Point(8, 16), 
    new Point(8, 17), new Point(8, 18), new Point(8, 19), new Point(8, 20), new Point(8, 21), 
    new Point(8, 24), new Point(8, 25), new Point(8, 26), new Point(8, 27), new Point(8, 30), 
    new Point(9, 2), new Point(9, 6), new Point(9, 21), new Point(9, 24), new Point(9, 30), 
    new Point(10, 2), new Point(10, 6), new Point(10, 21), new Point(10, 24), new Point(10, 30), 
    new Point(11, 2), new Point(11, 3), new Point(11, 4), new Point(11, 5), new Point(11, 6), 
    new Point(11, 7), new Point(11, 8), new Point(11, 9), new Point(11, 21), new Point(11, 22), 
    new Point(11, 23), new Point(11, 24), new Point(11, 25), new Point(11, 26), new Point(11, 27), 
    new Point(11, 30), new Point(12, 2), new Point(12, 9), new Point(12, 27), new Point(12, 30), 
    new Point(13, 2), new Point(13, 9), new Point(13, 27), new Point(13, 30), new Point(14, 2), 
    new Point(14, 5), new Point(14, 6), new Point(14, 7), new Point(14, 8), new Point(14, 9), 
    new Point(14, 27), new Point(14, 28), new Point(14, 29), new Point(14, 30), new Point(15, 2), 
    new Point(15, 5), new Point(15, 27), new Point(16, 2), new Point(16, 5), new Point(16, 27), 
    new Point(17, 2), new Point(17, 5), new Point(17, 6), new Point(17, 7), new Point(17, 8), 
    new Point(17, 9), new Point(17, 27), new Point(17, 28), new Point(17, 29), new Point(17, 30), 
    new Point(18, 2), new Point(18, 9), new Point(18, 27), new Point(18, 30), new Point(19, 2), 
    new Point(19, 9), new Point(19, 27), new Point(19, 30), new Point(20, 2), new Point(20, 3), 
    new Point(20, 4), new Point(20, 5), new Point(20, 6), new Point(20, 7), new Point(20, 8), 
    new Point(20, 9), new Point(20, 21), new Point(20, 22), new Point(20, 23), new Point(20, 24), 
    new Point(20, 25), new Point(20, 26), new Point(20, 27), new Point(20, 30), new Point(21, 2), 
    new Point(21, 6), new Point(21, 21), new Point(21, 24), new Point(21, 30), new Point(22, 2), 
    new Point(22, 6), new Point(22, 21), new Point(22, 24), new Point(22, 30), new Point(23, 2), 
    new Point(23, 6), new Point(23, 7), new Point(23, 8), new Point(23, 9), new Point(23, 12), 
    new Point(23, 13), new Point(23, 14), new Point(23, 15), new Point(23, 16), new Point(23, 17), 
    new Point(23, 18), new Point(23, 19), new Point(23, 20), new Point(23, 21), new Point(23, 24), 
    new Point(23, 25), new Point(23, 26), new Point(23, 27), new Point(23, 30), new Point(24, 2), 
    new Point(24, 6), new Point(24, 9), new Point(24, 12), new Point(24, 19), new Point(24, 24), 
    new Point(24, 27), new Point(24, 30), new Point(25, 2), new Point(25, 3), new Point(25, 4), 
    new Point(25, 5), new Point(25, 6), new Point(25, 9), new Point(25, 12), new Point(25, 19), 
    new Point(25, 24), new Point(25, 27), new Point(25, 28), new Point(25, 29), new Point(25, 30), 
    new Point(26, 2), new Point(26, 9), new Point(26, 10), new Point(26, 11), new Point(26, 12), 
    new Point(26, 19), new Point(26, 20), new Point(26, 21), new Point(26, 22), new Point(26, 23), 
    new Point(26, 24), new Point(26, 30), new Point(27, 2), new Point(27, 9), new Point(27, 24), 
    new Point(27, 30), new Point(28, 2), new Point(28, 3), new Point(28, 5), new Point(28, 6), 
    new Point(28, 7), new Point(28, 8), new Point(28, 9), new Point(28, 24), new Point(28, 25), 
    new Point(28, 26), new Point(28, 27), new Point(28, 29), new Point(28, 30)]
];

function floydWarshall(maze) {
  const WIDTH = 32;
  const HEIGHT = 32;
  const max = 10000;
  const n = WIDTH * HEIGHT;
  let dist = Array.from(Array(n), () => new Array(n).fill(max));

  for (let x = 0; x < WIDTH; x++) {
    for (let y = 0; y < HEIGHT; y++) {
      const tile = maze[x][y];
      if (tile !== null) {
        dist[x * HEIGHT + y][x * HEIGHT + y] = 0;
        tile.getNeighbours().forEach(neighbour => {
          if (neighbour !== null) {
            const p = neighbour.getPosition();
            dist[p.x * HEIGHT + p.y][x * HEIGHT + y] = 1;
            dist[x * HEIGHT + y][p.x * HEIGHT + p.y] = 1;
          }
        });
      }
    }
  }

  for (let x1 = 0; x1 < WIDTH; x1++) {
    for (let y1 = 0; y1 < HEIGHT; y1++) {
      for (let x2 = 0; x2 < WIDTH; x2++) {
        for (let y2 = 0; y2 < HEIGHT; y2++) {
          for (let x3 = 0; x3 < WIDTH; x3++) {
            for (let y3 = 0; y3 < HEIGHT; y3++) {
              const k = x1 * HEIGHT + y1;
              const i = x2 * HEIGHT + y2;
              const j = x3 * HEIGHT + y3;
              dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
            }
          }
        }
      }
    }
  }

  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      if (dist[x][y] >= max) {
        dist[x][y] = -1;
      }
    }
  }

  return dist;
}

class MoveDistance {
  constructor(move, distance) {
      this.move = move;
      this.distance = distance;
  }
}

class TileDistance {
  constructor(tile, g, h, parent = null) {
      this.tile = tile;
      this.g = g; // Cost from start to node
      this.h = h; // Heuristic cost from node to goal
      this.f = g + h; // Total cost
      this.parent = parent; // Parent node in path
  }

  compareTo(that) {
      return this.f - that.f;
  }

  equals(that) {
      if (this === that) return true;
      if (!that || !(that instanceof TileDistance)) return false;
      return this.f === that.f && this.g === that.g && this.h === that.h &&
             this.tileEquals(this.tile, that.node) &&
             this.tileEquals(this.parent, that.parent);
  }

  tileEquals(tile1, tile2) {
      if (tile1 === tile2) return true;
      if (tile1 == null || tile2 == null) return false;
      return tile1.equals(tile2);
  }
}


class PriorityQueue {
  constructor(comparator = (a, b) => a.f - b.f) {
      this.items = [];
      this.comparator = comparator;
  }

  enqueue(item) {
      this.items.push(item);
      this.bubbleUp();
  }

  dequeue() {
      const top = this.items[0];
      const bottom = this.items.pop();
      if (this.items.length > 0) {
          this.items[0] = bottom;
          this.bubbleDown();
      }
      return top;
  }

  isEmpty() {
      return this.items.length === 0;
  }

  bubbleUp() {
      let index = this.items.length - 1;
      const item = this.items[index];

      while (index > 0) {
          const parentIndex = Math.floor((index - 1) / 2);
          const parent = this.items[parentIndex];
          if (this.comparator(item, parent) >= 0) {
              break;
          }
          this.items[index] = parent;
          this.items[parentIndex] = item;
          index = parentIndex;
      }
  }

  bubbleDown() {
      let index = 0;
      const length = this.items.length;
      const item = this.items[index];

      while (true) {
          let leftChildIndex = 2 * index + 1;
          let rightChildIndex = 2 * index + 2;
          let leftChild, rightChild;
          let swap = null;

          if (leftChildIndex < length) {
              leftChild = this.items[leftChildIndex];
              if (this.comparator(leftChild, item) < 0) {
                  swap = leftChildIndex;
              }
          }

          if (rightChildIndex < length) {
              rightChild = this.items[rightChildIndex];
              if ((swap === null && this.comparator(rightChild, item) < 0) ||
                  (swap !== null && this.comparator(rightChild, leftChild) < 0)) {
                  swap = rightChildIndex;
              }
          }

          if (swap === null) {
              break;
          }

          this.items[index] = this.items[swap];
          this.items[swap] = item;
          index = swap;
      }
  }
}

function pathDistancePoint(point1, point2, dist) {
  return dist[point1.x * HEIGHT + point1.y][point2.x * HEIGHT + point2.y];
}

function pathDistanceTile(tile1, tile2, dist) {
  return pathDistancePoint(tile1.getPosition(), tile2.getPosition(), dist);
}

function aStarDistance(node, node2, dist) {
  const agenda = new PriorityQueue((a, b) => a.f - b.f);
  const visited = new Set();

  if (node !== null && node2 !== null) {
      agenda.enqueue(new TileDistance(node, 0, 0, null));
  }
  while (!agenda.isEmpty()) {
      const current = agenda.dequeue();
      if (current.node.equals(node2)) {
          let count = 0;
          while (current.parent !== null) {
              current = current.parent;
              count++;
          }
          return count;
      }
      for (const neighbour of current.node.getNeighbours()) {
          if (neighbour !== null) {
              const d = pathDistanceTile(node2, neighbour, dist);
              if (d >= 0 && !visited.has(neighbour)) {
                  const nd = new TileDistance(neighbour, current.g + 1, d, current);
                  agenda.enqueue(nd);
                  visited.add(neighbour);
              }
          }
      }
  }
  return -1;
}
