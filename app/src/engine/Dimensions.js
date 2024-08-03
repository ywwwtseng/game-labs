const Dimensions = {
  canvas: {
    get width() {
      return window.innerWidth + (16 - (window.innerWidth % 16));
    },
    get height() {
      return window.innerHeight + (16 - (window.innerHeight % 16));
    },
    get offset() {
      return {
        x: (16 - (window.innerWidth % 16)) / 2,
        y: (16 - (window.innerHeight % 16)) / 2,
      };
    },
  },
  screen: {
    get width() {
      return window.innerWidth;
    },
    get height() {
      return window.innerHeight;
    },
  },
  get(key) {
    return this[key];
  },
};

export default Dimensions;
