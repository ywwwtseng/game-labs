import Entity from '@/js/Entity';
import { loadKanjiSprite } from '@/js/sprites';

export function createKanji() {
  return loadKanjiSprite()
    .then((sprite) => {
      const kanji = new Entity();
      
      kanji.draw = function drawKanji(context) {
        sprite.draw('idle', context, this.pos.x, this.pos.y);
      };

      kanji.update = function updateKanji(deltaTime) {
        this.pos.x += this.vel.x * deltaTime;
        this.pos.y += this.vel.y * deltaTime;
      };

      return kanji;
    });
}