import Scene from '@/engine/Scene';
import { createColorLayer } from '@/engine/layers/color';
import { createTextLayer } from '@/engine/layers/text';

export default class LoadingScene extends Scene {
  constructor(gameContext) {
    super();

    this.text = '';
    this.gameContext = gameContext;
    this.comp.layers.push(createColorLayer('#000'));
    this.comp.layers.push(createTextLayer(this.gameContext.font, this));
  }
}
