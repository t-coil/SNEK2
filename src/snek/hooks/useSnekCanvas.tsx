import * as React from 'react';
import BackgroundCanvas from '../classes/BackgroundCanvas';
import GameCanvas from '../classes/GameCanvas';

type Constructor<T> = new (...args: any[]) => T;
type SnekCanvas = Constructor<BackgroundCanvas> | Constructor<GameCanvas>;

export default function useSnekCanvas(canvas: HTMLCanvasElement | null, canvasClass: SnekCanvas) {
  const [canvasClassInstance, setCanvasClassInstance] = React.useState<BackgroundCanvas | GameCanvas | null>(null);

  React.useEffect(() => {
    if (canvas != null && canvasClassInstance == null) {
      const context = canvas.getContext('2d');
      if (context == null) return;
      setCanvasClassInstance(new canvasClass(context));
    }
  }, [canvas, canvasClass, canvasClassInstance]);

  return canvasClassInstance;
}
