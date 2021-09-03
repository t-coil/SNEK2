function loadImagePromise(img) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => reject(img);
    image.src = typeof img === 'string' ? img : img.src;
  });
}

export {loadImagePromise};
