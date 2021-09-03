import * as React from 'react';
import lodash from 'lodash';

import AnimationWrapper from '../animation/AnimationWrapper';

import { Buttons } from '../easter-egg/SnekConstants';
import styles from './NellyAnimation.module.css';

const buttonDownSrc = require('./snek-nelly/images/404_btn_down.svg').default;
const buttonUpSrc = require('./snek-nelly/images/404_btn_up.svg').default;

const ButtonDown = <img alt="" src={buttonDownSrc} className={styles.button} />;

const ButtonUp = <img alt="" src={buttonUpSrc} className={styles.button} />;

class NellyAnimation extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      animationData: null,
      buttonShown: Buttons.UP,
    };

    this.onMouseDown = this.onMouseDown.bind(this);
    this.lazyLoadAnimation = this.lazyLoadAnimation.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  componentDidMount() {
    this.lazyLoadAnimation();
    this.mouseUpRef = document.addEventListener('mouseup', this.onMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.mouseUpRef);
    if (this.anim != null) {
      this.anim.destroy();
    }
  }

  onMouseDown(event) {
    if (this.isClickOnButton(event)) {
      this.setState({ buttonShown: Buttons.DOWN });
    }
  }

  onMouseUp() {
    const { buttonShown } = this.state;
    if (buttonShown === Buttons.DOWN) {
      this.setState({ buttonShown: Buttons.UP }, () => this.props.toggleSnek());
    }
  }

  isClickOnButton(event) {
    const wrapper = this.roboNellyRef.offsetParent;

    const preXPercent = 0.54;
    const preYPercent = 0.6;

    const percentageWidth = 0.075;
    const percentageHeight = 0.05;

    const width = this.roboNellyRef.clientWidth;
    const height = this.roboNellyRef.clientHeight;

    const xLow = width * preXPercent;
    const yLow = height * preYPercent;
    const xHigh = xLow + width * percentageWidth;
    const yHigh = yLow + height * percentageHeight;

    const x = event.pageX - wrapper.offsetLeft;
    const y = event.pageY - wrapper.offsetTop;

    return lodash.inRange(x, xLow, xHigh) && lodash.inRange(y, yLow, yHigh);
  }

  lazyLoadAnimation() {
    import('./snek-nelly').then(({ default: animationData }) => {
      this.setState({ animationData });
    });
  }

  setAnimationContainerRef = (ref) => {
    this.roboNellyRef = ref;
  };

  renderAnimation() {
    if (this.state.animationData == null) return null;
    return (
      <AnimationWrapper
        animationData={this.state.animationData}
        setContainerRef={this.setAnimationContainerRef}
      />
    );
  }

  render() {
    const button =
      this.state.buttonShown === Buttons.DOWN ? ButtonDown : ButtonUp;

    return (
      <div className={styles.animationWrapper} onMouseDown={this.onMouseDown}>
        {button}
        {this.renderAnimation()}
      </div>
    );
  }
}

export default NellyAnimation;
