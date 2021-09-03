/*
 * lottie doesn't allow server side rendering to complete, so polyfill what we need when server rendering.
 */

let lottie;

if (!global.isServerRendering) {
  lottie = require('lottie-web');
} else {
  lottie = {
    loadAnimation: () => ({
      playAnimation: () => {},
    }),
  };
}

export default lottie;
