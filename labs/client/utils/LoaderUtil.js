class LoaderUtil {
  static loadImage(url) {
    return new Promise((resolve) => {
      const image = new Image();
      image.addEventListener('load', () => {
        resolve(image);
      });
      image.src = url;
    });
  }

  static readFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.readAsDataURL(file);
    });
  }
}

export { LoaderUtil };
