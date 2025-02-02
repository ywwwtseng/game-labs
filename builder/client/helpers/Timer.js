class Timer {
  constructor(deltaTime = 1 / 60) {
    this._elapsed = false;

    this.deltaTime = deltaTime;
    this.accumulatedTime = 0;
    this.lastTime = null;
  }

  updateProxy(time) {
    if (this.lastTime) {
      this.accumulatedTime += (time - this.lastTime) / 1000;

      if (this.accumulatedTime > 1) {
        this.accumulatedTime = 1;
      }

      while (this.accumulatedTime > this.deltaTime) {
        this.update(this.deltaTime);
        this.accumulatedTime -= this.deltaTime;
      }
    }

    this.lastTime = time;
    this.enqueue();
  }

  enqueue() {
    if (!this._elapsed) {
      requestAnimationFrame(this.updateProxy.bind(this));
    }
  }

  start() {
    this.enqueue();
  }

  dispose() {
    this._elapsed = true;
    this.accumulatedTime = 0;
    this.lastTime = null;
  }
}

export { Timer };
