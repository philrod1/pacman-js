class View {

  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.scale = 2;
    this.pillColors = ['white', 'yellow', 'red', 'white'];
    this.decal = loadImage('res/decal.png');
    this.ghostSprites = loadImage('res/ghost_sprites.png');
    this.pacmanSprites = loadImage('res/ms_pacman_sprites.png');
    this.lifeImg = loadImage('res/life.png');
    this.font = loadImage('res/full_font.png');
    this.pill = loadImage('res/pill.png');
    this.powerPill = loadImage('res/power_pill.png');
    this.fruitSprites = loadImage('res/fruit_sprites.png');
    this.fruitScores = loadImage('res/fruit_scores.png');
    this.mazeImages = [
      [loadImage('res/maze1.png'), loadImage('res/maze1_b.png')],
      [loadImage('res/maze2.png'), loadImage('res/maze2_b.png')],
      [loadImage('res/maze3.png'), loadImage('res/maze3_b.png')],
      [loadImage('res/maze4.png'), loadImage('res/maze4_b.png')]
    ];
    this.tx = 61;
    this.ty = 67;
    resizeCanvas(420 * this.scale, 387 * this.scale);
  }

  drawAgents() {
    this.drawGhosts();
    this.drawPacman();
    this.drawFruit();
  }

  drawScore() {
    this.drawText("Level " + this.game.level, 2, 0);
    this.drawText(this.game.score.toString().padStart(7, ' '), 0, 1);
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
    for (let i = 0; i < this.game.lives; i++) {
      const dx = (x * 8 + i * 16) * this.scale;
      image(this.lifeImg, dx, dy, dw, dh, sx, sy, sw, sh);
    }
    sw = 16 * Math.min(this.game.level, 7);
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
    for (let i = 0; i < text.length; i++) {
      const dx = (x + i) * 8 * this.scale;
      const sx = (text.charCodeAt(i) - 32) * 8;
      image(this.font, dx, dy, dw, dh, sx, sy, sw, sh);
    }
    noTint();
  }

  drawPacman() {
    const pacman = this.game.pacman;
    const dx = pacman.pixel.x * this.scale - 8 * this.scale;
    const dy = pacman.pixel.y * this.scale - 8 * this.scale;
    const dw = 16 * this.scale;
    const dh = 16 * this.scale;
    const sx = Math.floor(pacman.frame / 4) * 16; // Which frame?
    const sy = pacman.move.ordinal * 16; // Which direction?
    const sw = 16;
    const sh = 16;
    image(this.pacmanSprites, dx, dy, dw, dh, sx, sy, sw, sh);
  }

  drawGhosts() {
    if (!this.game.ghosts) {
      return;
    }
    for (const ghost of this.game.ghosts) {
      let sxOffset = ghost.currentOrientation.ordinal * 32;
      let frame_offset = Math.floor((ghost.frame % 16) / 8) * 16;
      if (ghost.frightened) {
        sxOffset = 128;
        if (ghost.flashing && (ghost.frame % 12) == 0) {
          ghost.flash = (ghost.flash + 1) % 2;
        }
      } else if (ghost.state == 0) {
        if (ghost.chompPause > 0) {
          sxOffset = 256 + 16 * ghost.chompIndex;
        } else {
          sxOffset = 192 + ghost.currentOrientation.ordinal * 16;
        }
        frame_offset = 0;
        ghost.flash = 0;
      } else {
        ghost.flash = 0;
      }
      const dx = ghost.pixel.x * this.scale - 8 * this.scale;
      const dy = ghost.pixel.y * this.scale - 8 * this.scale;
      const dw = 16 * this.scale;
      const dh = 16 * this.scale;
      const sx = sxOffset + frame_offset + (ghost.flash * 32); // Which sprite?
      const sy = ghost.gid * 16; // Which ghost?
      const sw = 16;
      const sh = 16;
      image(this.ghostSprites, dx, dy, dw, dh, sx, sy, sw, sh);
    }
  }

  drawFruit() {
    const fruit = this.game.fruit;
    if (!fruit.active) {
      return;
    }
    const dx = fruit.pixel.x * this.scale - 8 * this.scale;
    const dy = (fruit.pixel.y + Fruit.BOUNCE[fruit.frame]) * this.scale - 8 * this.scale;
    const dw = 16 * this.scale;
    const dh = 16 * this.scale;
    const sx = 16 * (6 - fruit.fruit);
    const sy = 0;
    const sw = 16;
    const sh = 16;
    if (fruit.chomped) {
      image(this.fruitScores, dx, dy, dw, dh, sx, sy, sw, sh);
    }
    else {
      image(this.fruitSprites, dx, dy, dw, dh, sx, sy, sw, sh);
    }
  }

  drawMaze() {
    const maze = this.game.maze;
    const mazeImage = this.mazeImages[maze.mazeID][0];
    image(mazeImage, -16 * this.scale, -16 * this.scale, mazeImage.width * this.scale, mazeImage.height * this.scale);
    const color = this.pillColors[maze.mazeID];
    tint(color);
    for (let y = 0; y < 32; y++) {
      for (let x = 0; x < 32; x++) {
        let tile = maze.currentMaze[x][y];
        if (tile) {
          if (tile.value === 1) {
            image(this.pill, x * 8 * this.scale, y * 8 * this.scale, 8 * this.scale, 8 * this.scale);
          }
          else if (tile.value === 2) {
            image(this.powerPill, x * 8 * this.scale, y * 8 * this.scale, 8 * this.scale, 8 * this.scale);
          }
        }
      }
    }
    noTint();
  }

  flashMaze(index) {
    const img = this.mazeImages[this.game.maze.mazeID][index];
    image(img, -16 * this.scale, -16 * this.scale, img.width * this.scale, img.height * this.scale);
  }

  drawDecal() {
    image(
      this.decal,
      -this.tx * this.scale,
      -this.ty * this.scale,
      this.decal.width * this.scale / 2,
      this.decal.height * this.scale / 2
    );
  }
}