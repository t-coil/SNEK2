import * as React from 'react';

import SnekContainer from '../easter-egg/SnekContainer';
import FourOhFour from './404';
import NellyAnimation from './NellyAnimation';

import { KeyCodes, KonamiCode } from '../easter-egg/SnekConstants';
import '../styles/FontFace.module.css';
import styles from './index.module.css';

interface State {
  showSnek: boolean;
  keyDowns: any[];
}

class Error extends React.PureComponent<{}, State> {
  state: State = {
    showSnek: false,
    keyDowns: [],
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  toggleSnek = () => {
    this.setState({ showSnek: !this.state.showSnek });
  };

  handleKeyDown = (event: KeyboardEvent) => {
    const { keyDowns } = this.state;

    if (event.keyCode === KonamiCode[keyDowns.length]) {
      this.setState({ keyDowns: [...keyDowns, event.key] });

      if (event.keyCode === KeyCodes.A) {
        this.toggleSnek();
      }
    } else {
      this.setState({ keyDowns: [] });
    }

    if (event.keyCode === KeyCodes.ESC) {
      this.setState({ showSnek: false });
    }
  };

  render() {
    const { showSnek } = this.state;
    const snek = showSnek ? <SnekContainer /> : null;

    return (
      <div className={styles.pageWrap}>
        <div className={styles.textSection}>
          <FourOhFour />
          <h4 className={styles.wizards}>Wizards Behind Curtains?</h4>
          <div className={styles.suggestionText}>
            That's so 1939. Discord is secretly powered by quantum robot
            hamsters. Technology is wild, isn't it? Anyway, you look lost. Here
            are a few suggested pages.
          </div>
          <ul className={styles.linksSection}>
            <li>
              <a className={styles.links} href="https://discordstatus.com">
                Status Page
              </a>
            </li>
            <li>
              <a className={styles.links} href="https://twitter.com/discord">
                @Discord
              </a>
            </li>
            <li>
              <a
                className={styles.links}
                href="https://support.discord.com/hc/en-us"
              >
                Support
              </a>
            </li>
          </ul>
        </div>
        <NellyAnimation toggleSnek={this.toggleSnek} />
        {snek}
      </div>
    );
  }
}

export default Error;
