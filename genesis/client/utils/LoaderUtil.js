class LoaderUtil {
  static loadImage(url) {
    return new Promise((resolve) => {
      const image = new Image();
      image.addEventListener("load", () => {
        resolve(image);
      });
      image.src = url;
    });
  }
}

export { LoaderUtil };
