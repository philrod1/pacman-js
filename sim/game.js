class Game {
    constructor(scale) {
        this.numbers = loadImage('res/numbers.png');
        this.lifeImg = loadImage('res/life.png');
        this.font = loadImage('res/full_font.png');
        this.fruitSprites = loadImage('res/fruit_sprites.png');
        this.framesEnergised = [0, 360, 300, 240, 180, 120, 300, 120, 120, 60, 300, 120, 60, 60, 180, 60, 60, 0, 60];
        this.collisionsEnabled = false;

        this.energisedFramesRemaining = 0;
        this.energiserPauseFramesRemaining = 0;
        this.ghostEatenPauseFramesRemaining = 0;
        this.level = 1;
        this.lives = 3;
        this.pacman = new Pacman();
        this.maze = new SimMaze();
        this.fruit = new Fruit();
        this.pacmanOrientations = [MOVE.RIGHT, MOVE.DOWN, MOVE.LEFT, MOVE.UP];
        this.ghostsEaten = 0;
        this.score = 0;

        this.rng = Math.random;
        this.pacPause = 1;
        this.scale = scale;
        this.extraLife = true;

        //   this.level = game.getLevel();
        //   this.maze.setLevel(game.getLevel());
        //   this.score = game.getScore();
    }

    incLevel() {
        this.level++;
        this.maze.incLevel();
    }

    setLevel(level) {
        this.level = level;
        this.maze.setLevel(level);
    }

    initGhosts() {
        this.ghosts = [new Blinky(), new Pinky(), new Inky(), new Sue()];
        this.ghostManager = new GhostManager(this.ghosts);
    }

    setScale(scale) {
        this.scale = scale;
    }

    step() {
        // console.log(this);
        this.fruit.update(this);

        if (this.ghostEatenPauseFramesRemaining > 0) {
            for (let ghost of this.ghosts) {
                if (ghost.getState() === 0) {
                    ghost.update(this);
                }
            }
            this.ghostEatenPauseFramesRemaining--;
            return true;
        }

        if (this.energiserPauseFramesRemaining > 0) {
            // for (let ghost of this.ghosts) {
            //     ghost.update(this);
            // }
            this.ghosts.map(ghost => ghost.update(this));
            this.energiserPauseFramesRemaining--;
            return true;
        }
        this.ghostManager.update(this.level);

        if (this.energisedFramesRemaining > 0) {
            if (this.energisedFramesRemaining < 120) {
                for (let ghost of this.ghosts) {
                    ghost.flashing = true;
                } 
            }
            this.energisedFramesRemaining--;
            if (this.energisedFramesRemaining == 0) {
                this.pacman.setEnergised(false);
                for (let ghost of this.ghosts) {
                    ghost.setFrightened(false, this);
                    ghost.flashing = false;
                }
            }
        }

        this.pacman.update(this);

        if (this.checkGhostCollision()) {
            return false;
        }

        for (let ghost of this.ghosts) {
            if (this.maze.isSlow(ghost.getTile())) {
                ghost.setSlow(true);
            } else {
                ghost.setSlow(false);
            }
            ghost.update(this);
        }

        if (this.checkGhostCollision()) {
            return false;
        }

        if (this.maze.pillEaten(this.pacman.tile)) {
            this.pacman.pause(this.pacPause);
            this.ghostManager.pillEaten();
            this.score += 10;
            if (this.extraLife && this.score >= 10000) {
                this.lives++;
                this.extraLife = false
            }
            const pillCount = this.maze.pillCount;
            if (pillCount === 0) {
                this.fruit.reset();
            }
            if (pillCount <= ELROY_DOTS[0][this.level]) {
                this.ghosts[0].cruiseLevel = 1;
            } else if (pillCount <= ELROY_DOTS[1][this.level]) {
                this.ghosts[0].cruiseLevel = 2;
            }
            if (pillCount == 176 || pillCount == 64) {
                this.fruit.activate(this.level);
            }
        }

        if (this.maze.powerPillEaten(this.pacman.tile)) {
            this.ghostsEaten = 0;
            this.pacman.setEnergised(true);
            this.energisedFramesRemaining = this.getEnergisedFrames();
            this.energiserPauseFramesRemaining = 3;
            this.ghosts.map(ghost => {
                ghost.setFrightened(true, this);
            });
            this.ghostManager.pillEaten();
            this.score += 50;
            if (this.extraLife && this.score >= 10000) {
                this.lives++;
                this.extraLife = false
            }
        }

        this.pacman.incFrame();
        for (let ghost of this.ghosts) {
            ghost.incFrame();
        }

        return true;
    }

    getEnergisedFrames() {
        if (this.level < 19) {
            return this.framesEnergised[this.level];
        }
        return 0;
    }

    checkGhostCollision() {
        if (!this.collisionsEnabled) {
            return;
        }
        for (let ghost of this.ghosts) {
            if (ghost.getTile().equals(this.pacman.tile)) {
                if (ghost.getState() === 4) {
                    if (ghost.frightened) {
                        ghost.chomp(60);
                        this.ghostEatenPauseFramesRemaining = 60;
                        this.ghostsEaten++;
                        this.score += 100 * (1 << this.ghostsEaten);
                        this.ghostManager.incrementChompIndex();
                        return false;
                    }
                    this.pacman.setAlive(false);
                    this.fruit.reset();
                    return this.collisionsEnabled;
                } else {
                    return false;
                }
            }
        }
        return false;
    }

    isTargetSafe(target, snap, depth, move, maze) {
        if (depth === 0) {
            return 0;
        } else {
            this.syncToDataPoint(snap);
            let result = this.safeToTarget(target);
            if (result === 0) {
                let moves = maze.getAvailableMoves(this.pacman.tile);
                moves = moves.filter(m => m !== this.pacman.getCurrentMove().opposite);
                let dataPoint2 = new GameData(this);
                for (let m of moves) {
                    let result2 = this.isTargetSafe(maze.getNextDecisionPoint(this.pacman.tile, m), dataPoint2, depth - 1, m, maze);
                    if (result2 !== 0) {
                        return result2;
                    }
                    this.syncToDataPoint(dataPoint2);
                }
            } else if (result === 1) {
                return 1;
            }
        }
        return 0;
    }

    safeToTarget(target) {
        while (!this.pacman.tile.equals(target)) {
            this.pacman.setTarget(target);
            if (this.maze.pillCount === 0) {
                return 1;
            }
            if (!this.step()) {
                return -1;
            }
        }
        return 0;
    }

    syncToDataPoint(data) {
        this.ghosts[0].setPixelPosition(new Point(data.blinky.px, data.blinky.py));
        this.ghosts[0].setPreviousOrientation(data.blinky.previousOrientation);
        this.ghosts[0].setCurrentOrientation(data.blinky.currentOrientation);
        this.ghosts[0].setState(data.blinky.state);
        this.ghosts[0].setFrightened(data.blinky.frightened, this);
        this.ghosts[0].updatePatterns(data.blinky.getPatterns());
        this.ghosts[0].setCruiseLevel(data.blinky.cruiseLevel);

        this.ghosts[1].setPixelPosition(new Point(data.pinky.px, data.pinky.py));
        this.ghosts[1].setPreviousOrientation(data.pinky.previousOrientation);
        this.ghosts[1].setCurrentOrientation(data.pinky.currentOrientation);
        this.ghosts[1].setState(data.pinky.state);
        this.ghosts[1].setFrightened(data.pinky.frightened, this);
        this.ghosts[1].updatePatterns(data.pinky.getPatterns());

        this.ghosts[2].setPixelPosition(new Point(data.inky.px, data.inky.py));
        this.ghosts[2].setPreviousOrientation(data.inky.previousOrientation);
        this.ghosts[2].setCurrentOrientation(data.inky.currentOrientation);
        this.ghosts[2].setState(data.inky.state);
        this.ghosts[2].setFrightened(data.inky.frightened, this);
        this.ghosts[2].updatePatterns(data.inky.getPatterns());

        this.ghosts[3].setPixelPosition(new Point(data.sue.px, data.sue.py));
        this.ghosts[3].setPreviousOrientation(data.sue.previousOrientation);
        this.ghosts[3].setCurrentOrientation(data.sue.currentOrientation);
        this.ghosts[3].setState(data.sue.state);
        this.ghosts[3].setFrightened(data.sue.frightened, this);
        this.ghosts[3].updatePatterns(data.sue.getPatterns());

        this.pacman.setCurrentMove(data.pacman.currentMove);
        this.pacman.setPixelPosition(new Point(data.pacman.px, data.pacman.py));
        this.pacman.setEnergised(data.pacman.energised);
        this.pacman.updatePatterns(data.pacman.getPatterns());
        this.pacman.setAlive(data.pacman.alive);
        this.energisedFramesRemaining = data.energisedFramesRemaining;
        this.level = data.level;
        //TODO: Remove dependency on RAM
        // this.maze.sync(this.level, data.getRAM());
        // this.ghostManager.sync(this.level, data.getRAM());
        this.score = data.score;
        this.ghostsEaten = data.ghostsEaten;
    }

    copy() {
        return new GameData(this);
    }

    advanceToNextDecisionPoint(move, maze) {
        let target = maze.getNextDecisionPoint(this.pacman.tile, move);
        return this.advanceToTarget(target, maze);
    }

    advanceToNextTile(move, maze) {
        let target = maze.getNextTile(this.pacman.tile, move);
        return this.advanceToTarget(target, maze);
    }

    advanceToTarget(target, maze) {
        while (!this.pacman.tile.equals(target)) {
            this.pacman.setTarget(target);
            if (maze.pillCount === 0) {
                return 1;
            }
            if (!this.step()) {
                return -1;
            }
        }
        return 0;
    }

    getMaze() {
        return this.maze;
    }

    areGhostsRandom() {
        return this.ghostManager.areGhostsRandom();
    }

    draw(ctx, scale) {
        this.maze.draw(ctx, scale);
        // this.drawAgents(ctx, scale);
        this.drawScore();
        this.drawFooter();
        this.fruit.draw(ctx, scale);
    }

    drawAgents(ctx, scale) {
        if (this.ghosts) {
            this.drawGhosts(ctx, scale);
            this.pacman.draw(ctx, scale);
        }
    }

    drawGhosts(ctx, scale) {
        for (let i = 0; i < 4; i++) {
            this.ghosts[i].draw(ctx, scale);
        }
    }

    drawScore() {
        this.drawText("Level " + this.level, 2, 0);
        this.drawText(this.score.toString().padStart(7, ' '), 0, 1);
    }

    drawFooter() {
        const x = 4;
        const dy = 32 * 8 * this.scale;
        let dw = 16 * this.scale;
        const dh = 16 * this.scale;
        const sy = 0;
        let sx = 0;
        let sw = 16;
        const sh = 16;
        for (let i = 0 ; i < this.lives ; i++) {
            const dx = (x * 8 + i * 16) * this.scale;
            image(this.lifeImg, dx, dy, dw, dh, sx, sy, sw, sh);
        }
        sw = 16 * Math.min(this.level, 7);
        sx = 112 - sw;
        const dx = (14 * 8 + sx) * this.scale;
        dw = sw * this.scale;
        image(this.fruitSprites, dx, dy, dw, dh, sx, sy, sw, sh)
    }

    drawText(text, x, y, t = [255, 255, 255]) {
        y = y - 2;
        x = x + 2;
        const dy = 8 * this.scale * y;
        const dw = 8 * this.scale;
        const dh = 8 * this.scale;
        const sy = 0;
        const sw = 8;
        const sh = 8;
        tint(t);
        for (let i = 0 ; i < text.length ; i++) {
            const dx = (x + i) * 8 * this.scale;
            const sx = (text.charCodeAt(i) - 32) * 8;
            image(this.font, dx, dy, dw, dh, sx, sy, sw, sh);
        }
        noTint();
    }

}
