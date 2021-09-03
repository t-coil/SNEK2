import * as React from 'react';

import { loadImagePromise as loadImage } from './ImageUtils';

import { Dimensions, Images, Positions, Colors } from './SnekConstants';
import styles from './Scoreboard.module.css';

export default class Scoreboard extends React.PureComponent {
  constructor(props) {
    super(props);

    this.setRef = this.setRef.bind(this);
  }

  componentDidMount() {
    this.props.onRef(this);
    this.scoreboard = this.scoreCanvas.getContext('2d');
    this.setBoard();
    this.loadImages();
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  loadImages() {
    loadImage(Images.BIG_SNEK).then((bigSnek) => {
      this.props.drawImage(
        this.scoreboard,
        bigSnek,
        Dimensions.SCOREBOARD_CLEAR,
        0
      );
    });
    loadImage(Images.SPEECH_BUBBLE).then(
      (speechBubble) => (this.speechBubble = speechBubble)
    );
  }

  setBoard() {
    this.scoreboard.fillStyle = Colors.BLACK;
    this.scoreboard.fillRect(
      0,
      0,
      Dimensions.CANVAS_WIDTH,
      Dimensions.SCOREBOARD_HEIGHT
    );
  }

  resetBoard() {
    this.scoreboard.fillRect(
      0,
      0,
      Dimensions.SCOREBOARD_CLEAR,
      Dimensions.SCOREBOARD_HEIGHT
    );
  }

  renderText(item) {
    if (!this.textDisplayed) {
      this.props.drawImage(
        this.scoreboard,
        this.speechBubble,
        Positions.SPEECH_BUBBLE_X,
        Positions.SPEECH_BUBBLE_Y
      );
      this.props.drawImage(
        this.scoreboard,
        item.textImg,
        Math.floor(
          Positions.QUOTE_X -
            (Dimensions.CANVAS_WIDTH_HALVED + item.textImg.width / 2)
        ),
        Math.floor(
          Positions.QUOTE_Y -
            (Dimensions.SCOREBOARD_HEIGHT_HALVED + item.textImg.height / 2)
        )
      );
      this.textDisplayed = true;
      clearTimeout(this.textTimeout);
      this.textTimeout = setTimeout(() => {
        this.scoreboard.fillRect(
          0,
          0,
          Dimensions.SCOREBOARD_CLEAR,
          Dimensions.SCOREBOARD_HEIGHT
        );
        this.textDisplayed = false;
      }, 4000);
    }
  }

  setRef(ref) {
    this.scoreCanvas = ref;
  }

  render() {
    return (
      <div className={styles.boardWrapper}>
        <div className={styles.score}>SCORE: {this.props.points}</div>
        <canvas
          width={Dimensions.CANVAS_WIDTH}
          height={Dimensions.SCOREBOARD_HEIGHT}
          ref={(scoreCanvas) => (this.scoreCanvas = scoreCanvas)}
          className={styles.canvas}
        />
      </div>
    );
  }
}
