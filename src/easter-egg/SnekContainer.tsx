import * as React from 'react';

import Snek from './Snek';
import TitleScreen from './TitleScreen';
import {loadImagePromise as loadImage} from './ImageUtils';

import styles from './SnekContainer.module.css';
import UnityGame from '../unity';

enum GameSteps {
  TITLE_SCREEN,
  SNEK_1,
  SNEK_2,
}

const loadingScreenSrc = require('./images/loading-screen.png').default;

export default function SnekContainer() {
  const [gameStep, setGameStep] = React.useState(GameSteps.TITLE_SCREEN);
  const [playSound, setPlaySound] = React.useState(true);

  React.useEffect(() => {
    loadImage(loadingScreenSrc);
  }, []);

  function goToGameStep(step: GameSteps) {
    setGameStep(step);
  }

  function toggleSound() {
    setPlaySound(!playSound);
  }

  function getCurrentView() {
    switch (gameStep) {
      case GameSteps.TITLE_SCREEN:
        return (
          <TitleScreen onClick={() => goToGameStep(GameSteps.SNEK_1)} toggleSound={toggleSound} muted={!playSound} />
        );
      case GameSteps.SNEK_1:
        return <Snek muted={!playSound} onStartSNEK2={() => goToGameStep(GameSteps.SNEK_2)} />;
      case GameSteps.SNEK_2:
        return (
          <div className={styles.snek2Container}>
            <UnityGame loadingScreenSrc={loadingScreenSrc} />
          </div>
        );
    }
  }

  return <div className={styles.overlay}>{getCurrentView()}</div>;
}
