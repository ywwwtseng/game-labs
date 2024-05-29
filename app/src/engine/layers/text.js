import Dimensions from '@/engine/Dimensions';

export function createTextLayer(font, scene) {
  const size = font.size;
  return function drawText(context) {
    const textW = scene.text.length * size;
    const screenW = Dimensions.get('screen').width;
    const screenH = Dimensions.get('screen').height;
    const x = screenW / 2 - textW / 2;
    const y = screenH / 2;


    font.print(scene.text, context, x, y);
  }
}