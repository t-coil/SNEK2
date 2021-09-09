import * as React from 'react';

import BackgroundCanvas from '../classes/BackgroundCanvas';
import GameCanvas from '../classes/GameCanvas';
import GameOverCanvas from '../classes/GameOverCanvas';

type Constructor<T> = new (...args: any[]) => T;
// type SnekCanvasConstructor = Constructor<BackgroundCanvas> | Constructor<GameCanvas> | Constructor<GameOverCanvas>;
// type SnekCanvas = BackgroundCanvas | GameCanvas | GameOverCanvas;

export function useCanvasRef<T>(CanvasClass: Constructor<T>): [T | null, (newNode: HTMLCanvasElement | null) => void] {
  const [node, setNode] = React.useState<HTMLCanvasElement | null>(null);
  const [canvasClassInstance, setCanvasClassInstance] = React.useState<T | null>(null);

  const setRef = React.useCallback((newNode: HTMLCanvasElement | null) => {
    if (newNode != null) {
      setNode(newNode);
    }
  }, []);

  React.useEffect(() => {
    if (node != null && canvasClassInstance == null) {
      const context = node.getContext('2d');
      if (context == null) return;
      setCanvasClassInstance(new CanvasClass(context));
    }
  }, [node, CanvasClass, canvasClassInstance]);

  return [canvasClassInstance, setRef];
}
