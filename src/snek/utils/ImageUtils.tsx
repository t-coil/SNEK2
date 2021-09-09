import {Images, ImageSources} from '../Constants';

export function loadImage(img: string | HTMLImageElement): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => reject(img);
    image.src = typeof img === 'string' ? img : img.src;
  });
}

// For preloading when you don't care about when it's done
export function loadImages(imgSrcs: string[]) {
  for (const src of imgSrcs) {
    loadImage(src);
  }
}

function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

export async function getPreloadedImages(): Promise<Record<Images, HTMLImageElement>> {
  const preloadedImages = enumKeys(Images).reduce((acc, key) => {
    acc[key] = new Image();
    return acc;
  }, {} as Record<Images, HTMLImageElement>);

  for (const img of enumKeys(Images)) {
    const src = ImageSources[img];
    const loadedImage = await loadImage(src);
    preloadedImages[img] = loadedImage;
  }

  return preloadedImages;
}
