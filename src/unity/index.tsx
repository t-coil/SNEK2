import * as React from 'react';
import Unity, { UnityContext } from 'react-unity-webgl';

import styles from './index.module.css';

const unityContext = new UnityContext({
  loaderUrl: 'unitybuild/SNEK2.loader.js',
  dataUrl: 'unitybuild/SNEK2.data.unityweb',
  frameworkUrl: 'unitybuild/SNEK2.framework.js.unityweb',
  codeUrl: 'unitybuild/SNEK2.wasm.unityweb',
});

function LoadingScreen() {
  return (
    <div className={styles.loadingScreenContainer}>
      <div>
        <ul>
          <li>- Press space to move through dialogue</li>
          <li>- Use F1 to return home if you jump off the map</li>
          <li>- Complete all the levels to unlock the final secret level!</li>
        </ul>
      </div>
      <div className={styles.loadingLine}>
        Finding you the perfect therapist...
      </div>
    </div>
  );
}

export default function UnityGame() {
  const [isUnityLoaded, setIsUnityLoaded] = React.useState(false);

  React.useEffect(() => {
    unityContext.on('loaded', handleOnUnityLoaded);
  }, []);

  function handleOnUnityLoaded() {
    setIsUnityLoaded(true);
  }

  return (
    <div className={styles.unityContainer}>
      {!isUnityLoaded && <LoadingScreen />}
      <Unity className={styles.unityCanvas} unityContext={unityContext} />
    </div>
  );
}
