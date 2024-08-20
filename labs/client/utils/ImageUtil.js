class ImageUtil {
  static getSize(image) {
    const width = image.naturalWidth;
    const height = image.naturalHeight;

    return {
      width,
      height,
    };
  }
  static getSizeIndex(image) {
    const size = ImageUtil.getSize(image);

    return [Math.ceil(size.width / 16), Math.ceil(size.height / 16)];
  }
}

export { ImageUtil };
