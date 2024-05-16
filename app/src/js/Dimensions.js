const Dimensions = {
  screen: {
    get width() {
      return window.innerWidth + (16 - window.innerWidth % 16);
    },
    get height() {
      return window.innerHeight + (16 - window.innerHeight % 16);
    },
    get top() {
      return (16 - window.innerHeight % 16) / 2;
    },
    get left() {
      return (16 - window.innerWidth % 16) / 2;
    }
  },
  get(key) {
    return this[key];
    
  }
};

export default Dimensions;
