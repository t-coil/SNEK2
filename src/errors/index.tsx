import * as React from 'react';

import SnekContainer from '../easter-egg/SnekContainer';
import FourOhFour from './404';
import NellyAnimation from './NellyAnimation';

import {KeyCodes, KonamiCode} from '../easter-egg/SnekConstants';
import '../styles/FontFace.module.css';
import styles from './index.module.css';

export default function Error() {
  const [showSnek, setShowSnek] = React.useState(false);
  const [keyDowns, setKeyDowns] = React.useState<string[]>([]);

  function toggleSnek() {
    setShowSnek(!showSnek);
  }

  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.key === KonamiCode[keyDowns.length]) {
        setKeyDowns([...keyDowns, event.key]);

        if (event.key === KeyCodes.A) {
          setShowSnek(true);
        }
      } else {
        setKeyDowns([]);
      }

      if (event.key === KeyCodes.ESC) {
        setShowSnek(false);
      }
    },
    [keyDowns]
  );

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className={styles.pageWrap}>
      <div className={styles.textSection}>
        <FourOhFour />
        <h4 className={styles.wizards}>Wizards Behind Curtains?</h4>
        <div className={styles.suggestionText}>
          That's so 1939. Discord is secretly powered by quantum robot hamsters. Technology is wild, isn't it? Anyway,
          you look lost. Here are a few suggested pages.
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
            <a className={styles.links} href="https://support.discord.com/hc/en-us">
              Support
            </a>
          </li>
        </ul>
      </div>
      <NellyAnimation toggleSnek={toggleSnek} />
      {showSnek && <SnekContainer />}
    </div>
  );
}
