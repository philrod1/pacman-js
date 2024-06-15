class View {

  constructor(game, ctx, scale) {
    this.game = game;
    this.ctx = ctx;
    this.scale = scale;
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
    this.decalBitImages = [
      loadImage('res/decal-bit-left-1.png'),
      loadImage('res/decal-bit-right-1.png'),
      loadImage('res/decal-bit-left-2.png')
    ];
    this.decalBits = [
      [
        { img: this.decalBitImages[0], x: -8, y: 68 },
        { img: this.decalBitImages[0], x: -8, y: 140 },
        { img: this.decalBitImages[1], x: 240, y: 68 },
        { img: this.decalBitImages[1], x: 240, y: 140 }
      ],
      [
        { img: this.decalBitImages[0], x: -8, y: 12 },
        { img: this.decalBitImages[2], x: -8, y: 188 },
        { img: this.decalBitImages[1], x: 240, y: 12 },
        { img: this.decalBitImages[1], x: 240, y: 188 }
      ],
      [
        { img: this.decalBitImages[0], x: -8, y: 76 },
        { img: this.decalBitImages[1], x: 240, y: 76 }
      ], [
        { img: this.decalBitImages[0], x: -8, y: 108 },
        { img: this.decalBitImages[0], x: -8, y: 132 },
        { img: this.decalBitImages[1], x: 240, y: 108 },
        { img: this.decalBitImages[1], x: 240, y: 132 }
      ]
    ];
    this.tx = 61;
    this.ty = 67;
    this.textBoxes = [];
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
    this.textBoxes.push({x: x, y: y, l: text.length});
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

  drawPills() {
    const maze = this.game.maze;
    this.ctx.fillStyle = 'WHITE';
    const color = this.pillColors[maze.mazeID];
    tint(color);
    for (let y = 0; y < 32; y++) {
      for (let x = 0; x < 32; x++) {
        let tile = maze.currentMaze[x][y];
        if (tile) {
          if (tile.value === 1) {
            // image(this.pill, x * 8 * this.scale, y * 8 * this.scale, 8 * this.scale, 8 * this.scale);
            this.ctx.beginPath();
            this.ctx.arc((4 + x * 8) * this.scale, (4 + y * 8) * this.scale, 1 * this.scale, 0, 2 * Math.PI);
            this.ctx.fill();
          }
          else if (tile.value === 2) {
            // image(this.powerPill, x * 8 * this.scale, y * 8 * this.scale, 8 * this.scale, 8 * this.scale);
            this.ctx.beginPath();
            this.ctx.arc((4 + x * 8) * this.scale, (4 + y * 8) * this.scale, 3 * this.scale, 0, 2 * Math.PI);
            this.ctx.fill();
          }
        }
      }
    }
    noTint();
  }

  drawMaze() {
    const maze = this.game.maze;
    const mazeImage = this.mazeImages[maze.mazeID][0];
    image(mazeImage, -16 * this.scale, -16 * this.scale, mazeImage.width * this.scale, mazeImage.height * this.scale);
  }

  drawDecalBits() {
    const maze = this.game.maze;
    const bits = this.decalBits[maze.mazeID];
    for (const bit of bits) {
      image(bit.img, bit.x * this.scale, bit.y * this.scale, bit.img.width * this.scale / 2, bit.img.height * this.scale / 2);
    }
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

  clearAgents() {
    this.ctx.fillStyle = 'BLACK';
    const agents = [];
    if (this.game.ghosts) {
      agents.push(... this.game.ghosts);
    }
    if (this.game.fruit.active) {
      agents.push(this.game.fruit);
    }
    for (const agent of agents) {
      this.ctx.fillRect((agent.pixel.x - 8) * this.scale, (agent.pixel.y - 8) * this.scale, 16 * this.scale, 16 * this.scale);
    }
    const pixel = this.game.pacman.pixel;
    this.ctx.beginPath();
    this.ctx.arc((pixel.x) * this.scale, (pixel.y) * this.scale, 8 * this.scale, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  clearText() {
    this.ctx.fillStyle = 'BLACK';
    for (const textBox of this.textBoxes) {
      this.ctx.fillRect(textBox.x * 8 * this.scale, textBox.y * 8 * this.scale, textBox.l * 8 * this.scale, 8 * this.scale);
    }
    this.textBoxes = [];
  }
}