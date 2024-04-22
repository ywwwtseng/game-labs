import Entity from '@/js/Entity';
import Velocity from '@/js/traits/Velocity';
import Jump from '@/js/traits/Jump';
import { loadKanjiSprite } from '@/js/sprites';

export function createKanji() {
  return loadKanjiSprite()
    .then((sprite) => {
      const kanji = new Entity();

      kanji.addTrait(new Velocity());
      kanji.addTrait(new Jump());

      kanji.draw = function drawKanji(context) {
        sprite.draw('idle', context, this.pos.x, this.pos.y);
      };

      return kanji;
    });
}