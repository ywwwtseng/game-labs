class ImageUtil {
  static getSize(image) {
    const width = image.naturalWidth;
    const height = image.naturalHeight;

    return {
      width,
      height
    };
  }
  static getIndex(image) {
    const size = ImageUtil.getSize(image);

    return  [
      Math.ceil(size.width / 16 - 1),
      Math.ceil(size.height / 16 - 1),
    ]
  }
}

export { ImageUtil };