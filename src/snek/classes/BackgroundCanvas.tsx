import {CanvasSizes, Colors} from '../Constants';
import BaseCanvas from './BaseCanvas';

export default class BackgroundCanvas extends BaseCanvas {
  boardDrawn: boolean;

  constructor(context: CanvasRenderingContext2D) {
    super(context);
    this.boardDrawn = false;
  }

  drawBoard(fence: HTMLImageElement) {
    this.context.fillStyle = Colors.GREEN_LAWN;
    this.context.fillRect(0, 0, CanvasSizes.GAME_WIDTH, CanvasSizes.GAME_AREA_HEIGHT);
    this.context.save();
    this.drawImage(fence, 0, 0);
    this.boardDrawn = true;
  }

  drawDoor() {}
}
