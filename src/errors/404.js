import * as React from 'react';

import styles from './FourOhFour.module.css';

export default class FourOhFour extends React.PureComponent {
  render() {
    return (
      <div className={styles.glitchWrapper}>
        <div className={styles.glitch} data-text="404">
          404
        </div>
      </div>
    );
  }
}
