import * as React from 'react';
import Unity, { UnityContext } from 'react-unity-webgl';

import styles from './index.module.css';

const unityContext = new UnityContext({
  loaderUrl: 'unitybuild/build.loader.js',
  dataUrl: 'unitybuild/build.data.unityweb',
  frameworkUrl: 'unitybuild/build.framework.js.unityweb',
  codeUrl: 'unitybuild/build.wasm.unityweb',
});

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
      {!isUnityLoaded && (
        <div className={styles.loadingLine}>
          Finding you the perfect therapist...
        </div>
      )}
      <Unity className={styles.unityCanvas} unityContext={unityContext} />
    </div>
  );
}
