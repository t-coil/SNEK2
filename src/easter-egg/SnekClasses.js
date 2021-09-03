import lodash from 'lodash';

import {StartPosition, SnekPieces} from './SnekConstants';

export class Position {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  setCoords(x, y) {
    this.x = x;
    this.y = y;
  }

  getKeyString() {
    return `${this.x}_${this.y}`;
  }

  parseKeyString(str) {
    const coords = str.split('_');
    this.x = parseInt(coords[0], 10);
    this.y = parseInt(coords[1], 10);

    return this;
  }
}

export class SnekPiece extends Position {
  constructor(direction, type, previousPiece = null) {
    super();
    this.direction = direction;
    this.type = type;
    this.previousPiece = previousPiece;
  }
}

export class PlayerSnek {
  constructor(position, head, tail, alive, loaded) {
    this.position = position;
    this[SnekPieces.HEAD] = head;
    this[SnekPieces.TAIL] = tail;
    this.alive = alive;
    this.loaded = loaded;
  }

  removePiece(str) {
    delete this.position[str];
  }

  setDefaultSnek() {
    lodash.forEach(StartPosition, (piece, key) => {
      this.position[key] = new SnekPiece(piece.direction, piece.type, piece.previousPiece);
      this.position[key].parseKeyString(key);
      if (piece.type === SnekPieces.HEAD) {
        this[SnekPieces.HEAD] = key;
      } else if (piece.type === SnekPieces.TAIL) {
        this[SnekPieces.TAIL] = key;
      }
    });

    return this;
  }

  spriteSheetOnload(self, img) {
    self.snekSprite = img;
    this.loaded = true;
    self.drawSnek();
  }
}

export class Game {
  constructor(speed, items, snek) {
    this.speed = speed;
    this.items = items;
    this.snek = snek;
  }
}
