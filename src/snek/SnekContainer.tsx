import * as React from 'react';
import {Images} from './Constants';
import SnekGame from './SnekGame';
import {getPreloadedImages} from './utils/ImageUtils';

export default function SnekGameLoader() {
  const [loadedImages, setLoadedImages] = React.useState<Record<Images, HTMLImageElement> | null>(null);

  React.useEffect(() => {
    async function loadImages() {
      const images = await getPreloadedImages();
      setLoadedImages(images);
    }

    loadImages();
  }, []);

  if (loadedImages == null) return null;

  return <SnekGame images={loadedImages} />;
}
