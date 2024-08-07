class DomUtil {
  static stopPropagation(event) {
    event.stopPropagation();
  }

  static getEl(T) {
    if (typeof T === 'string') {
      return document.getElementById(T);
    }

    return T;
  }

  static downloadImage({ name, buffer }) {
    const image = buffer.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = name;
    link.click();
  }
}

export { DomUtil };
