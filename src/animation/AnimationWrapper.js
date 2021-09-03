import * as React from 'react';
import VisibilitySensor from './VisibilitySensor';

import lottie from './lottie';

export {};

export default class AnimationWrapper extends React.PureComponent {
  anim = null;
  animationContainer = null;
  isVisible = false;
  rafId = null;

  static defaultProps = {
    autoplay: true,
    loop: true,
    renderer: 'svg',
    rendererSettings: {
      preserveAspectRatio: 'xMinYMid meet',
    },
  };

  componentDidMount() {
    global.document.addEventListener(
      'readystatechange',
      this.handleReadyStateChange
    );
    this.rafId = global.requestAnimationFrame(this.loadAnimation);
  }

  componentWillUnmount() {
    global.document.removeEventListener(
      'readystatechange',
      this.handleReadyStateChange
    );
    global.cancelAnimationFrame(this.rafId);
    if (this.anim != null) this.anim.destroy();
  }

  loadAnimation = () => {
    const {
      animationData,
      loop,
      renderer,
      rendererSettings,
      setAnimationInstance,
    } = this.props;

    this.anim = lottie.loadAnimation({
      animationData,
      container: this.animationContainer,
      autoplay: false,
      loop,
      renderer,
      rendererSettings,
    });

    if (setAnimationInstance) setAnimationInstance(this.anim);

    this.maybePlayAnimation();
  };

  maybePlayAnimation = () => {
    if (
      this.isVisible &&
      this.anim &&
      this.props.autoplay &&
      global.document.readyState === 'complete'
    ) {
      this.rafId = global.requestAnimationFrame(() => this.anim.play());
    }
  };

  handleReadyStateChange = () => {
    this.maybePlayAnimation();
  };

  handleVisibilityChange = (isVisible) => {
    const { autoplay, onVisibilityChange } = this.props;

    if (onVisibilityChange) onVisibilityChange(isVisible);

    if (autoplay && this.anim && global.document.readyState === 'complete') {
      const method = isVisible ? 'play' : 'pause';
      this.rafId = global.requestAnimationFrame(() => this.anim[method]());
    }

    this.isVisible = isVisible;
  };

  setRef = (ref) => {
    this.animationContainer = ref;
    const { setContainerRef } = this.props;
    if (setContainerRef) setContainerRef(ref);
  };

  render() {
    const { 'aria-label': ariaLabel } = this.props;

    return (
      <VisibilitySensor onChange={this.handleVisibilityChange}>
        <div
          ref={this.setRef}
          className={this.props.className}
          aria-label={ariaLabel}
        />
      </VisibilitySensor>
    );
  }
}
