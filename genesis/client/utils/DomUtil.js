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
}

export { DomUtil };
