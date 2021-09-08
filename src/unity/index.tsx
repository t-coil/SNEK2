import * as React from 'react';
import Unity, {UnityContext} from 'react-unity-webgl';

import styles from './index.module.css';

const unityContext = new UnityContext({
  loaderUrl: 'unitybuild/SNEK2.loader.js',
  dataUrl: 'unitybuild/SNEK2.data.unityweb',
  frameworkUrl: 'unitybuild/SNEK2.framework.js.unityweb',
  codeUrl: 'unitybuild/SNEK2.wasm.unityweb',
});

interface UnityGameProps {
  loadingScreenSrc: string;
}

export default function UnityGame({loadingScreenSrc}: UnityGameProps) {
  const [isUnityLoaded, setIsUnityLoaded] = React.useState(false);

  React.useEffect(() => {
    unityContext.on('loaded', handleOnUnityLoaded);
  }, []);

  function handleOnUnityLoaded() {
    setIsUnityLoaded(true);
  }

  return (
    <div className={styles.unityContainer}>
      {!isUnityLoaded ? <img className={styles.loadingScreen} src={loadingScreenSrc} alt="loading screen" /> : null}
      <Unity className={styles.unityCanvas} unityContext={unityContext} />
    </div>
  );
}
