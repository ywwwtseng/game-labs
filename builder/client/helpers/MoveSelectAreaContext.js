class MoveSelectAreaContext {
  constructor() {
    this._init();
  }

  _init() {
    this._inited = false;
    this.duplicate = false;
    this.duplicate_and_move = false;

    this.origin = {
      default: null,
      follows: null,
    };

    this.data = {};
  }

  destroy() {
    this._init();
  }

  init(callback) {
    if (this._inited === false) {
      this._inited = true;
      callback?.();
    }
  }
}

export { MoveSelectAreaContext };