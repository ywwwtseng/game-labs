import Dimensions from '@/engine/Dimensions';

export function createTextLayer(font, text) {
  const size = font.size;
  return function drawText(context) {
    const textW = text.length * size;
    const screenW = Dimensions.get('screen').width;
    const screenH = Dimensions.get('screen').height;
    const x = screenW / 2 - textW / 2;
    const y = screenH / 2;

    font.print(text, context, x, y);
  }
}