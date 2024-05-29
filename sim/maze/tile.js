class Tile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.neighbours = [null, null, null, null]; // Corresponds to up, left, down, right
        this.blocked = [null, null, null, null];
        this.value = 0; // 0: empty, 1: pill, 2: power pill
        this.isGhostHome = false;
        this.isJunction = false;
        this.isCorner = false;
        this.isDecisionPoint = false;
        this.moves = [];
        this.position = new Point(x, y);
        // this.spriteRAM = 0x4000 + (31 - x) * 32 + y; // Assuming the same memory mapping as in Java
    }

    hasPill() {
        return this.value === 1;
    }

    hasPowerPill() {
        return this.value === 2;
    }

    isGhostHome() {
        return this.isGhostHome;
    }

    setHasPill(hasPill) {
        this.value = hasPill ? 1 : 0;
    }

    setHasPowerPill(hasPowerPill) {
        this.value = hasPowerPill ? 2 : 0;
    }

    setGhostHome(isGhostHome) {
        this.isGhostHome = isGhostHome;
    }

    getNeighbour(move) {
        return this.neighbours[move.ordinal];
    }

    getNeighbours() {
        return this.neighbours;
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

    getResetValue() {
        return this.value;
    }

    init() {
        Object.values(MOVE).forEach(move => {
            let n = this.neighbours[move.ordinal];
            if (n !== null) {
                this.moves.push(move);
            }
        });
        if (this.moves.length > 2) {
            this.isJunction = true;
            this.isDecisionPoint = true;
        } else if (this.moves[0] !== this.moves[1].opposite) {
            this.isCorner = true;
            this.isDecisionPoint = true;
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

    getAvailableMoves() {
        return [...this.moves];
    }

    getPosition() {
        return this.position;
    }

    getCentrePoint() {
        return { x: this.x * 8 + 4, y: this.y * 8 + 4 };
    }

    draw(ctx, scale) {
        //   ctx.fillStyle = '#222222';
        //   ctx.fillRect(this.x * 8 * scale, this.y * 8 * scale, 8 * scale, 8 * scale);
        if (this.value === 1) {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(
                this.getCentrePoint().x * scale,
                this.getCentrePoint().y * scale,
                scale,
                0,
                2 * Math.PI);
            ctx.fill();
        }
        if (this.value === 2) {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(this.getCentrePoint().x * scale, this.getCentrePoint().y * scale, 2 * scale, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    isDecisionPoint() {
        return this.isDecisionPoint;
    }

    toString() {
        return `(${this.x},${this.y})`;
    }

    getValue() {
        return this.value;
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
        for (const move2 of MOVE) {
            if (move2 !== move) {
                if (this.block(move2)) {
                    blockedMoves.push(move2);
                }
            }
        };
        return blockedMoves;
    }

    blockAllMoves() {
        for (const move of MOVE) {
            this.block(move);
        };
    }

    unblockAllMoves() {
        for (const move of MOVE) {
            this.unblock(move);
        };
    }

    unblockAll(blockedMoves) {
        if (blockedMoves) {
            blockedMoves.forEach(move => {
                this.unblock(move);
            });
        }
    }
}
