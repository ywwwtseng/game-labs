import Entity from '@/js/Entity';
import Go from '@/js/traits/Go';
// import Velocity from '@/js/traits/Velocity';
import Jump from '@/js/traits/Jump';
import { loadKanjiSprite } from '@/js/sprites';

export function createKanji() {
  return loadKanjiSprite()
    .then((sprite) => {
      const kanji = new Entity();

      kanji.addTrait(new Go());
      kanji.addTrait(new Jump());
      // kanji.addTrait(new Velocity());
      
      kanji.draw = function drawKanji(context) {
        sprite.draw('idle', context, 0, 0);
      };

      return kanji;
    });
}