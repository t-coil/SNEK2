import lodash from 'lodash';

import {DoorBoundaries} from './SnekConstants';

interface Coordinates {
  x: number;
  y: number;
}

export function checkDoorCollision(newHead: Coordinates) {
  if (
    lodash.inRange(newHead.x, DoorBoundaries.LEFT, DoorBoundaries.RIGHT) &&
    lodash.inRange(newHead.y, DoorBoundaries.TOP, DoorBoundaries.BOTTOM)
  ) {
    return true;
  }
  return false;
}

export function isSnekAtDoorEntrance(newHead: Coordinates) {
  return newHead.x === DoorBoundaries.ENTRANCE_X && newHead.y === DoorBoundaries.ENTRANCE_Y;
}
