import { useRef, useEffect } from 'react';
import { CanvasUtil } from '@/utils/CanvasUtil';

export const CANVAS_LAYER = {
  GRID: ({ width, height }) => ({
    name: 'GRID',
    buffer: CanvasUtil.createGridBuffer(width + 1, height + 1),
  }),
  SPRITE_LAYERS: ({ layers, camera }) => ({
    name: 'SPRITE_LAYERS',
    buffer: CanvasUtil.createSpriteLayersBuffer(
      layers,
      camera,
    ),
  })
};

function Canvas2D({
  id = 'canvas',
  layers = [],
  cache,
  camera,
  width,
  height,
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = ref.current.getContext('2d');
    CanvasUtil.clear(ctx);

    layers.forEach((layer) => {
      if (layer.buffer) {
        ctx.drawImage(layer.buffer, 0, 0);
      } else if (typeof layer === 'function') {
        layer(ctx);
      }
    });

    if (cache) {
      cache(ctx);
    }
  }, [layers, cache]);

  return (
    <canvas
      ref={ref}
      id={id}
      className="bg-[#373737]"
      width={width + 1}
      height={height + 1}
      {...props}
    />
  );
}

export { Canvas2D };
