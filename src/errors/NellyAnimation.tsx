import * as React from 'react';
import {loadImages} from '../easter-egg/ImageUtils';
import AnimationWrapper from '../animation/AnimationWrapper';
import lodash from 'lodash';

import {Buttons} from '../easter-egg/SnekConstants';
import styles from './NellyAnimation.module.css';

type AnimationData = Record<string, any>;

interface NellyAnimationProps {
  toggleSnek: () => void;
}

const buttonDownSrc = require('./snek-nelly/images/404_btn_down.svg').default;
const buttonUpSrc = require('./snek-nelly/images/404_btn_up.svg').default;

export default function NellyAnimation({toggleSnek}: NellyAnimationProps) {
  const [animationData, setAnimationData] = React.useState<AnimationData | null>(null);
  const [buttonShown, setButtonShown] = React.useState(Buttons.UP);
  const roboNellyRef = React.useRef<HTMLDivElement | null>(null);

  function onMouseUp() {
    if (buttonShown === Buttons.DOWN) {
      setButtonShown(Buttons.UP);
      toggleSnek();
    }
  }

  async function loadAssets() {
    const animationData = await import('./snek-nelly');
    setAnimationData(animationData.default);
    loadImages([buttonDownSrc, buttonUpSrc]);
  }

  React.useEffect(() => {
    loadAssets();
    document.addEventListener('mouseup', onMouseUp);

    return () => document.removeEventListener('mouseup', onMouseUp);
  });

  function renderAnimation() {
    if (animationData == null) return null;
    return (
      <AnimationWrapper
        animationData={animationData}
        setContainerRef={(ref: any) => {
          roboNellyRef.current = ref;
        }}
      />
    );
  }

  function isClickOnButton(event: React.MouseEvent<HTMLDivElement>) {
    const animRef = roboNellyRef.current;
    if (animRef == null || animRef.offsetParent == null) return;

    const wrapper = animRef.offsetParent as HTMLElement;

    const preXPercent = 0.54;
    const preYPercent = 0.6;

    const percentageWidth = 0.075;
    const percentageHeight = 0.05;

    const width = animRef.clientWidth;
    const height = animRef.clientHeight;

    const xLow = width * preXPercent;
    const yLow = height * preYPercent;
    const xHigh = xLow + width * percentageWidth;
    const yHigh = yLow + height * percentageHeight;

    const x = event.pageX - wrapper.offsetLeft;
    const y = event.pageY - wrapper.offsetTop;

    return lodash.inRange(x, xLow, xHigh) && lodash.inRange(y, yLow, yHigh);
  }

  function onMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    if (isClickOnButton(event)) {
      setButtonShown(Buttons.DOWN);
    }
  }

  return (
    <div className={styles.animationWrapper} onMouseDown={onMouseDown}>
      <img alt="snek button" src={buttonShown === Buttons.UP ? buttonUpSrc : buttonDownSrc} className={styles.button} />
      {renderAnimation()}
    </div>
  );
}
