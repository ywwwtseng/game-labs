export function loadImage(url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.src = url;
  });
}

export function loadJSON(url) {
  return fetch(url, { mode: 'cors'}).then((r) => r.json());
}
