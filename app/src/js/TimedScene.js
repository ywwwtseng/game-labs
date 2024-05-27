import BaseScene from '@/js/BaseScene';

export default class TimedScene extends BaseScene {
  constructor() {
    super();

    this.countDown = 2;
  }

  update(gameContext) {
    this.countDown -= gameContext.deltaTime;
    if (this.countDown <= 0) {
      this.events.emit(BaseScene.EVENT_COMPLETE);
    }
  }
}