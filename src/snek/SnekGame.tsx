import * as React from 'react';
import Game from './classes/Game';
import {Snek} from './classes/Snek';
import {CanvasSizes, Images, KeyCodes, KeyCodeToDirection} from './Constants';

import styles from './index.module.css';
import {useCanvasRef} from './hooks/useCanvasRef';
import BackgroundCanvas from './classes/BackgroundCanvas';
import GameCanvas from './classes/GameCanvas';
import GameOverCanvas from './classes/GameOverCanvas';

function GameOver({points}: {points: number}) {
  <div className={styles.gameOverText}>
    <div className={styles.winner}>YOU LOST</div>
    <div>
      <div>Points: {points}</div>
      <div>Press ENTER To Reset SNEK</div>
      <div>Press ESC To Exit SNEK (๑◕︵◕๑)</div>
      <div className={styles.snek2Instructions}>Press CMD/CTRL + ENTER To Talk About Your Feelings</div>
    </div>
  </div>;
}

export default function SnekGame({images}: {images: Record<Images, HTMLImageElement>}) {
  const [backgroundCanvas, setBackgroundRef] = useCanvasRef(BackgroundCanvas);
  const [gameCanvas, setGameCanvasRef] = useCanvasRef(GameCanvas);
  const [gameOverCanvas, setGameOverRef] = useCanvasRef(GameOverCanvas);

  const gameInstance = React.useRef(new Game(new Snek()));

  function handleKeyDown(event: KeyboardEvent) {
    const game = gameInstance.current;
    if (event.key === KeyCodes.ENTER) {
      //
    }
    const direction = KeyCodeToDirection[event.key];
    if (direction == null) return;

    game.tick(direction);
    if (game.gameOver) {
      //
    }
  }

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  React.useEffect(() => {
    if (backgroundCanvas != null && !backgroundCanvas.boardDrawn) {
      backgroundCanvas.drawBoard(images[Images.SNEK_FENCE]);
    }
  }, [backgroundCanvas, images]);

  return (
    <>
      <canvas
        width={CanvasSizes.GAME_WIDTH}
        height={CanvasSizes.TOTAL_GAME_HEIGHT}
        ref={setGameOverRef}
        className={styles.gameOverCanvas}
      />
      <div className={styles.gameWrap}>
        <canvas
          width={CanvasSizes.GAME_WIDTH}
          height={CanvasSizes.GAME_AREA_HEIGHT}
          ref={setBackgroundRef}
          className={styles.gameCanvas}
        />
        <canvas
          width={CanvasSizes.GAME_WIDTH}
          height={CanvasSizes.GAME_AREA_HEIGHT}
          ref={setGameCanvasRef}
          className={styles.gameCanvas}
        />
      </div>
    </>
  );
}
