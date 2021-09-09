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
