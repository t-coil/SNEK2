import * as React from 'react';
import lodash from 'lodash';

import { loadImagePromise as loadImage } from './ImageUtils';

import {
  Dimensions,
  TitleImages,
  KeyCodes,
  SCALE,
  Colors,
  NORMAL_VOLUME,
} from './SnekConstants';
import styles from './TitleScreen.module.css';

const VolumeButtonPadding = 10;

export default class TitleScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      howTo: false,
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleCanvasClick = this.handleCanvasClick.bind(this);
    this.setRef = this.setRef.bind(this);
    this.showHowTo = this.showHowTo.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    this.titleCard = this.canvas.getContext('2d');
    this.titleCard.fillStyle = Colors.GREEN_LAWN;

    this.startMusic();
    this.loadImages().then((images) => this.setTitleCard(images));
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.youFoundSnek.removeEventListener('ended', this.musicListener);

    this.themeSong.pause();
    this.youFoundSnek.pause();
  }

  componentDidUpdate() {
    const volume = this.props.muted ? 0 : NORMAL_VOLUME;
    this.themeSong.volume = volume;
    this.youFoundSnek.volume = volume;
  }

  loadImages() {
    const promises = [];

    for (const img in TitleImages) {
      promises.push(loadImage(TitleImages[img]));
    }

    return Promise.all(promises);
  }

  setTitleCard(images) {
    const titleImages = Object.keys(TitleImages);

    lodash.forEach(titleImages, (imgName, index) => {
      const currentImage = TitleImages[imgName];
      currentImage.img = images[index];

      if (imgName !== 'SOUND_OFF') {
        this.drawImage(currentImage);
      }
    });
  }

  drawImage(image) {
    if (image.modifier) {
      const width = Math.floor(
        Dimensions.CANVAS_WIDTH_HALVED - image.img.width / 2
      );
      const height = Math.floor(
        Dimensions.FULL_HEIGHT / 2 - image.img.height / 2 + image.modifier
      );
      this.titleCard.drawImage(image.img, width, height);
    } else {
      this.titleCard.drawImage(image.img, image.x, image.y);
    }
  }

  startMusic() {
    this.themeSong = new Audio(require('./sounds/snek_menu.mp3').default);
    this.themeSong.loop = true;
    this.themeSong.volume = 0.09;

    this.youFoundSnek = new Audio(require('./sounds/snek_found.mp3').default);
    this.youFoundSnek.volume = 0.09;
    this.musicListener = this.youFoundSnek.addEventListener('ended', () => {
      this.themeSong.play();
    });

    this.youFoundSnek.play();
  }

  handleKeyDown(event) {
    if (event.keyCode === KeyCodes.ENTER) {
      const nextPage = this.state.howTo ? this.props.onClick : this.showHowTo;
      nextPage();
    }
  }

  handleCanvasClick(event) {
    if (!this.isClickOnVolume(event)) {
      this.setState({ howTo: true });
    } else {
      this.props.toggleSound();
      const volumeImage = this.props.muted ? 'ON' : 'OFF';
      this.titleCard.fillRect(
        0,
        Dimensions.FULL_HEIGHT - SCALE - 10,
        SCALE + VolumeButtonPadding,
        SCALE + VolumeButtonPadding
      );
      this.drawImage(TitleImages[`SOUND_${volumeImage}`]);
    }
  }

  setRef(ref) {
    this.canvas = ref;
  }

  showHowTo() {
    this.setState({ howTo: true });
  }

  isClickOnVolume(event) {
    const percentageWidth = 0.07;
    const percentageHeight = 0.1;

    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    const x = event.pageX - this.canvas.offsetLeft;
    const y = event.pageY - this.canvas.offsetTop;

    if (x < width * percentageWidth && y > height * percentageHeight) {
      return true;
    }
    return false;
  }

  render() {
    const view = this.state.howTo ? (
      <img
        alt=""
        className={styles.titleCard}
        width={Dimensions.CANVAS_WIDTH}
        height={Dimensions.FULL_HEIGHT}
        src={require('./images/how_to.png').default}
        onClick={this.props.onClick}
      />
    ) : (
      <canvas
        ref={this.setRef}
        width={Dimensions.CANVAS_WIDTH}
        height={Dimensions.FULL_HEIGHT}
        className={styles.titleCardAnimated}
        onClick={this.handleCanvasClick}
      />
    );
    return <div className={styles.container}>{view}</div>;
  }
}
