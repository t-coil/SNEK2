import {Direction, GameItem} from './Constants';

export interface Coordinate {
  x: number;
  y: number;
}

export interface Item extends Coordinate {
  item: GameItem;
  value: number;
}

export interface BodyPiece extends Coordinate {
  direction: Direction;
}
