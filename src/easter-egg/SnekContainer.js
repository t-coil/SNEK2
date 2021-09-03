import * as React from 'react';

import Snek from './Snek';
import TitleScreen from './TitleScreen';

import styles from './SnekContainer.module.css';
import UnityGame from '../unity';

const GameSteps = {
  TITLE_SCREEN: 'title_screen',
  SNEK_1: 'snek_1',
  SNEK_2: 'snek_2',
};

export default class SnekContainer extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      gameStep: GameSteps.TITLE_SCREEN,
      playSound: true,
    };

    this.toggleSound = this.toggleSound.bind(this);
  }

  goToSNEK1 = () => {
    this.setState({ gameStep: GameSteps.SNEK_1 });
  };

  goToSNEK2 = () => {
    this.setState({ gameStep: GameSteps.SNEK_2 });
  };

  toggleSound() {
    this.setState({ playSound: !this.state.playSound });
  }

  render() {
    let view = (
      <TitleScreen
        onClick={this.goToSNEK1}
        toggleSound={this.toggleSound}
        muted={!this.state.playSound}
      />
    );

    if (this.state.gameStep === GameSteps.SNEK_1) {
      view = (
        <Snek muted={!this.state.playSound} onStartSNEK2={this.goToSNEK2} />
      );
    } else if (this.state.gameStep === GameSteps.SNEK_2) {
      view = (
        <div className={styles.snek2Container}>
          <UnityGame />
        </div>
      );
    }

    return <div className={styles.overlay}>{view}</div>;
  }
}
