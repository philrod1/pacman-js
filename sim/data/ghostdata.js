class GhostData {
  
  constructor(source, ghost) {
      this.ghost = ghost;
      if (Array.isArray(source) && source.length === 6) {
          this.initFromArray(source);
      } else if (typeof source === 'object') {
          this.initFromObject(source);
      }
  }

  initFromArray(data) {
      this.px = data[0];
      this.py = data[1];
      this.state = data[2];
      this.previousOrientation = data[3];
      this.currentOrientation = data[4];
      this.frightened = data[5];
      this.pillCount = data[6];
      this.normal = data[7];
      this.scared = data[8];
      this.slow = data[9];
      this.elroy1 = data[10];
      this.elroy2 = data[11];
      this.cruiseLevel = data[12];
  }

  initFromObject(that) {
      this.px = that.px;
      this.py = that.py;
      this.state = that.state;
      this.previousOrientation = that.previousOrientation;
      this.currentOrientation = that.currentOrientation;
      this.frightened = that.frightened;
      this.pillCount = that.pillCount;
      this.normal = that.normal;
      this.scared = that.scared;
      this.slow = that.slow;
      this.elroy1 = that.elroy1;
      this.elroy2 = that.elroy2;
      this.cruiseLevel = that.cruiseLevel;
  }

  toTinyData() {
      let data = this.px & 255;
      data = (data << 8) | (this.py & 255);
      data = (data << 3) | (this.state & 7);
      data = (data << 2) | (this.previousOrientation & 3);
      data = (data << 2) | (this.currentOrientation & 3);
      data = (data << 1) | (this.frightened ? 1 : 0);
      data = (data << 8) | (this.ghost === 0 ? this.cruiseLevel : this.pillCount);
      return data;
  }

  getDataArray() {
      return [
          this.toTinyData(),
          this.normal,
          this.scared,
          this.slow,
          this.elroy1,
          this.elroy2
      ];
  }

  copy() {
      return new GhostData({
          px: this.px,
          py: this.py,
          state: this.state,
          previousOrientation: this.previousOrientation,
          currentOrientation: this.currentOrientation,
          frightened: this.frightened,
          pillCount: this.pillCount,
          normal: this.normal,
          scared: this.scared,
          slow: this.slow,
          elroy1: this.elroy1,
          elroy2: this.elroy2,
          cruiseLevel: this.cruiseLevel,
          ghost: this.ghost
      });
  }

  getPatterns() {
      return [this.normal, this.scared, this.slow, this.elroy1, this.elroy2];
  }
}
