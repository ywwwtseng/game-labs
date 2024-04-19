export function loadImage(url) {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.src = url;
  });
}

export function loadLand(name) {
  return fetch(`/land/${name}.json`)
    .then(r => r.json());
}
