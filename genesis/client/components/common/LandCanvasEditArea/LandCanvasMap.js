import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedMode } from '@/features/appState/appStateSlice';
import { CanvasUtil } from '@/utils/CanvasUtil';
import { useCursor } from '@/hooks/useCursor';
import { contain } from '@/helpers/BoundingBox';
import { updateCameraPos, normalizeCameraPos } from '@/features/camera/cameraSlice';
import { destroy as destroyEditMode } from '@/features/editMode/editModeSlice';

function LandCanvasMap({
  object2DLayers,
  camera,
  land,
  spriteSheets,
  width = 192,
  height = 192,
}) {
  const dispatch = useDispatch();
  const mode = useSelector(selectedMode);

  const viewport = useMemo(() => ({
    x: camera.pos.x * width / land.width + 0.5,
    y: camera.pos.y * height / land.height + 0.5,
    width: (camera.size.x / land.width) * width - 1,
    height: (camera.size.y / land.height) * height - 1,
  }), [camera, land, width, height]);

  const { setup } = useCursor({
    onMove: (event) => {
      event.target.style.cursor = 'default';
      if (contain(event, { in: { bounds: viewport, with: 'land-canvas-map' } })) {
        event.target.style.cursor = 'pointer';
      }
    },
    onDownMove: (_, { delta }) => {
      if (delta) {
        dispatch(destroyEditMode());
        dispatch(updateCameraPos({
          delta: {
            x: (delta.x / width) * land.width,
            y: (delta.y / height) * land.height,
          },
        }));
      }
    },
    onMoveEnd: (event) => {
      event.target.style.cursor = 'default';
      dispatch(normalizeCameraPos());
    },
  });

  useEffect(() => {
    const ctx = document.getElementById('land-canvas-map').getContext('2d');
    ctx.clearRect(0, 0, width, height);

    const buffer = CanvasUtil.createSpriteLayersBuffer(
      CanvasUtil.createSpriteLayers({ land, spriteSheets }),
      {
        pos: {x: 0, y: 0},
        size: {x: land.width, y: land.height},
      }
    )

    ctx.drawImage(buffer,0, 0, land.width, land.height, 0, 0, width, height);

    const canvas = document.createElement('canvas');
    canvas.width = land.width;
    canvas.height = land.height;
    object2DLayers(0)(canvas.getContext('2d'));
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, width, height);

    ctx.beginPath();
    ctx.rect(
      viewport.x,
      viewport.y,
      viewport.width,
      viewport.height,
    );
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.stroke();


  }, [object2DLayers, viewport, mode, land, spriteSheets]);

  return (
    <canvas
      id="land-canvas-map"
      className='absolute z-[50] top-[12px] right-[12px] bg-[#2B2B2B]'
      width={width}
      height={height}
      {...setup}
    >
    </canvas>
  );
}

export { LandCanvasMap };