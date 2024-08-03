import Trait from '@/engine/Trait';

export default class Killable extends Trait {
  constructor() {
    super();
    this.dead = false;
    this.deadTime = 0;
    this.removeAfter = 0.5;
  }

  kill() {
    this.queue(() => (this.dead = true));
  }

  revive() {
    this.dead = false;
    this.deadTime = 0;
  }

  update(entity, { deltaTime }, scene) {
    if (this.dead) {
      this.deadTime += deltaTime;
      if (this.deadTime > this.removeAfter) {
        this.queue(() => {
          scene.entities.splice(
            scene.entities.findIndex((e) => e === entity),
            1,
          );
        });
      }
    }
  }
}
