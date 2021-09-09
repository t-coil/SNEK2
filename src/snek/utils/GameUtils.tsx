import {GameItem, GameItemData, FenceCoordinates} from '../Constants';
import {BodyPiece, Item} from '../SnekTypes';

function _getNumberInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

function _getWeightedGameItemList() {
  let list: GameItem[] = [];

  Object.entries(GameItemData).forEach(([item, itemData]) => {
    list = [...list, ...Array(itemData.dropRate).fill(item)];
  });

  return list;
}

export const WeightedGameItemList = _getWeightedGameItemList();

export function getRandomBoardCoordinates(occupiedSquares: (BodyPiece | Item)[]): {x: number; y: number} {
  const x = _getNumberInRange(1, FenceCoordinates.HORIZONTAL.max);
  const y = _getNumberInRange(1, FenceCoordinates.VERTICAL.max);

  const occupiedSquare = occupiedSquares.find((square) => square.x === x && square.y === y);
  if (occupiedSquare != null) {
    return getRandomBoardCoordinates(occupiedSquares);
  }

  return {x, y};
}
