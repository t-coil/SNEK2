import {SCALE} from '../Constants';

export default class BaseCanvas {
  context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  drawImage(
    img: HTMLImageElement,
    canvasX: number,
    canvasY: number,
    doScale: boolean = false,
    imgX?: number,
    imgY?: number
  ) {
    const x = doScale ? canvasX * SCALE : canvasX;
    const y = doScale ? canvasY * SCALE : canvasY;

    if (imgX != null && imgY != null) {
      this.context.drawImage(img, imgX, imgY, SCALE, SCALE, x, y, SCALE, SCALE);
    } else {
      this.context.drawImage(img, x, y);
    }
  }
}
