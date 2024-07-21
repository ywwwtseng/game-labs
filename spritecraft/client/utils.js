export function loadImage(url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => {
      resolve(image);
    });
    image.src = url;
  });
}

export function getPosition(event) {
  const offset = event.target.getBoundingClientRect();
  return {
    x: event.pageX - offset.x,
    y: event.pageY - offset.y,
  };
}

export function getIndex(pos) {
  return {
    x: Math.ceil((pos.x) / 16) - 1,
    y: Math.ceil((pos.y) / 16) - 1,
  };
}
