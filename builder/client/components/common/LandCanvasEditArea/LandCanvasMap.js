import { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedMode } from '@/features/appState/appStateSlice';
import { CanvasUtil } from '@/utils/CanvasUtil';
import { useCursor } from '@/hooks/useCursor';
import { contain } from '@/helpers/BoundingBox';
import { updateCameraPos, normalizeCameraPos } from '@/features/camera/cameraSlice';
import { destroy as destroyEditMode } from '@/features/editMode/editModeSlice';
import { LAND_CANVAS_MAP_TYPE, LAND_TOTAL } from '@/constants';

function LandCanvasMap({
  mapType,
  object2DLayers,
  camera,
  land,
  spriteSheets,
  width = 192,
  height = 192,
}) {
  const canMoveCamera = useRef(false);
  const ref = useRef(null);
  const dispatch = useDispatch();
  const mode = useSelector(selectedMode);

  const viewport = useMemo(() => ({
    x: camera.pos.x * width / land.width + 0.5,
    y: camera.pos.y * height / land.height + 0.5,
    width: (camera.size.x / land.width) * width - 1,
    height: (camera.size.y / land.height) * height - 1,
  }), [camera, land, width, height]);

  const { setup } = useCursor({
    onDownMoveStart: (event) => {
      if (contain(event, { in: { bounds: viewport, with: ref.current } })) {
        canMoveCamera.current = true;
      }
    },
    onDownMove: (event, { delta }) => {
      if (canMoveCamera.current) {
        if (delta) {
          event.target.style.cursor = 'pointer';
          dispatch(destroyEditMode());
          dispatch(updateCameraPos({
            delta: {
              x: (delta.x / width) * land.width,
              y: (delta.y / height) * land.height,
            },
          }));
        }
      }
    },
    onDownMoveEnd: (event) => {
      canMoveCamera.current = false;
      event.target.style.cursor = 'default';
      dispatch(normalizeCameraPos());
    },
  });

  useEffect(() => {
    const ctx = ref.current.getContext('2d');

    ctx.globalAlpha = 1;

    if (mapType === LAND_CANVAS_MAP_TYPE.WORLD) {
      ctx.globalAlpha = 0.2;
    }
    
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

    ctx.globalAlpha = 1;

    if (mapType === LAND_CANVAS_MAP_TYPE.LOCAL) {
      ctx.beginPath();
      ctx.rect(
        viewport.x,
        viewport.y,
        viewport.width,
        viewport.height,
      );
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.stroke();
    }

    if (mapType === LAND_CANVAS_MAP_TYPE.WORLD) {
      const no = Number(land.id.replace('land_', ''));

      ctx.beginPath();
      ctx.rect(
        Math.floor(no / Math.sqrt(LAND_TOTAL)),
        (no - 1) % Math.sqrt(LAND_TOTAL),
        width / Math.sqrt(LAND_TOTAL),
        height / Math.sqrt(LAND_TOTAL),
      );
      ctx.fillStyle = 'red';
      ctx.fill();
    }



    


  }, [object2DLayers, viewport, mode, land, spriteSheets, mapType]);

  return (
    <canvas
      ref={ref}
      className='absolute z-[50] top-[12px] right-[12px] bg-[#2B2B2B]'
      width={width}
      height={height}
      {...setup}
    >
    </canvas>
  );
}

export { LandCanvasMap };