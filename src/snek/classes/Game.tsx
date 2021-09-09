import {remove, sample} from 'lodash';

import {Speed} from '../../easter-egg/SnekConstants';
import {Direction, GameItemData} from '../Constants';
import {getRandomBoardCoordinates, WeightedGameItemList} from '../GameUtils';
import {Item} from '../SnekTypes';
import {Snek} from './Snek';

const GameSpeeds = {
  START: 200,
  NORMAL: 80,
  SPEEDY: 65,
  TURBO: 50,
};

const MAX_ITEMS_ON_BOARD = 4;
const RANDOM_NUMBER_RANGE_MULTIPLIER = 7;

export default class Game {
  speed: number;
  items: Item[];
  points: number;
  isActive: boolean;
  gameOver: boolean;
  snek: Snek;
  timeout: NodeJS.Timeout | null;

  constructor(snek: Snek) {
    this.speed = GameSpeeds.START;
    this.items = [];
    this.points = 0;
    this.isActive = false;
    this.gameOver = false;
    this.snek = snek;
    this.timeout = null;
  }

  addPoints(newPoints: number) {
    this.points += newPoints;
  }

  adjustSpeed() {
    // Use high speeds for when user has a lot of points
    if (this.points > 100) {
      this.speed = this.points > 300 ? Speed.TURBO : Speed.SPEEDY;
      return;
    }

    if (this.speed > Speed.NORMAL) {
      // Incrementally increase speed until we hit "Normal" speed.
      this.speed = Math.max(this.speed * 0.9, Speed.NORMAL);
    }
  }

  dealWithItemCollisions() {
    const itemsCopy = [...this.items];
    // Remove will mutate itemsCopy and return a list of removed items. There can only be one item at any given
    // coordinate, so if a matching item is found, there will only ever be one.
    const collidedItemList = remove(
      itemsCopy,
      (activeItem) => activeItem.x === this.snek.head.x && activeItem.y === this.snek.head.y
    );
    const collidedItem = collidedItemList[0];

    if (collidedItem == null) {
      this.snek.doNotGrow();
    } else {
      this.points += collidedItem.value;
      this.items = itemsCopy;
    }
  }

  maybeDropItems() {
    if (this.items.length === MAX_ITEMS_ON_BOARD) return;
    const shouldDropNewItem = Math.floor(Math.random() * this.items.length * RANDOM_NUMBER_RANGE_MULTIPLIER) === 0;

    if (shouldDropNewItem) {
      const chosenItem = sample(WeightedGameItemList);
      if (chosenItem == null) return;

      const occupiedSquares = [...this.snek.bodyPosition, ...this.items];
      const {x, y} = getRandomBoardCoordinates(occupiedSquares);
      const newItem = {
        x,
        y,
        item: chosenItem,
        value: GameItemData[chosenItem].value,
      };

      this.items = [...this.items, newItem];
    }
  }

  handleGameOver() {
    this.gameOver = true;
    this.isActive = false;

    if (this.timeout != null) {
      clearTimeout(this.timeout);
    }
  }

  startNormalGame() {
    this.isActive = true;
    this.tick();
  }

  tick(direction?: Direction) {
    if (this.timeout != null) {
      clearTimeout(this.timeout);
    }

    if (this.snek.alive) {
      this.snek.move(direction);

      if (!this.snek.alive) {
        this.handleGameOver();
      } else {
        this.dealWithItemCollisions();
        this.maybeDropItems();
      }

      this.timeout = setTimeout(() => {
        this.tick();
      }, this.speed);
    }
  }
}
