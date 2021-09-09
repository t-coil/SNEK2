import {Direction, DirectionMovement, FenceCoordinates} from '../Constants';
import {BodyPiece} from '../SnekTypes';

const DEFAULT_POSITION = [
  {x: 11, y: 6, direction: Direction.UP},
  {x: 11, y: 7, direction: Direction.UP},
  {x: 11, y: 8, direction: Direction.UP},
  {x: 11, y: 9, direction: Direction.UP},
];

function isInvalidMoveForSnek(newDirection: Direction, snekHead: BodyPiece) {
  const {direction} = snekHead;
  switch (newDirection) {
    case Direction.UP:
      return direction === Direction.DOWN;
    case Direction.DOWN:
      return direction === Direction.UP;
    case Direction.LEFT:
      return direction === Direction.RIGHT;
    case Direction.RIGHT:
      return direction === Direction.LEFT;
  }
}

function getNewHorizontalPosition(oldX: number, direction: Direction) {
  if (direction === Direction.UP || direction === Direction.DOWN) return oldX;
  return oldX + DirectionMovement[direction];
}

function getNewVerticalPosition(oldY: number, direction: Direction) {
  if (direction === Direction.LEFT || direction === Direction.RIGHT) return oldY;
  return oldY + DirectionMovement[direction];
}

export class Snek {
  bodyPosition: BodyPiece[];
  alive: boolean;

  constructor() {
    this.bodyPosition = [...DEFAULT_POSITION];
    this.alive = false;
  }

  get head() {
    return this.bodyPosition[0];
  }

  get tail() {
    return this.bodyPosition[this.bodyPosition.length - 1];
  }

  hasCollidedWithSelf(newHead: BodyPiece) {
    return this.bodyPosition.find((bodyPiece) => bodyPiece.x === newHead.x && bodyPiece.y === newHead.y);
  }

  hasCollidedWithFence(newHead: BodyPiece) {
    const {HORIZONTAL, VERTICAL} = FenceCoordinates;

    const hasHitHorizontalFence = newHead.x === HORIZONTAL.min || newHead.x === HORIZONTAL.max;
    const hasHitVerticalFence = newHead.y === VERTICAL.min || newHead.y === VERTICAL.max;

    return hasHitHorizontalFence || hasHitVerticalFence;
  }

  move(direction?: Direction) {
    const currentHead = this.head;
    // If the user has not specifically input an action, we
    // are just ticking in the default direction;
    const newDirection = direction || currentHead.direction;
    if (isInvalidMoveForSnek(newDirection, currentHead)) return;

    const newHead = {
      direction: newDirection,
      x: getNewHorizontalPosition(currentHead.x, newDirection),
      y: getNewVerticalPosition(currentHead.y, newDirection),
    };

    const deathByStepOnSnek = this.hasCollidedWithSelf(newHead);
    const deathByFence = this.hasCollidedWithFence(newHead);

    if (deathByStepOnSnek || deathByFence) {
      this.alive = false;
    }

    // We don't want to animate further if the user has hit a fence.
    if (!deathByFence) {
      this.bodyPosition = [newHead, ...this.bodyPosition];
    }
  }

  doNotGrow() {
    this.bodyPosition.pop();
  }
}
