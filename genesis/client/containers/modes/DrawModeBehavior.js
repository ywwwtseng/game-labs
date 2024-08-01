import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { useSpriteSheets } from "@/context/SpriteSheetContext";
import { useCursor } from "@/hooks/useCursor";
import { draw } from "@/features/appState/appStateSlice";
import { getBoundingBox, contain } from '@/helpers/BoundingBox';

function DrawModeBehavior({ children }) {
  const spriteSheets = useSpriteSheets();
  const drawMode = useSelector((state) => state.drawMode);
  const dispatch = useDispatch();

  const { setup } = useCursor({
    icon: useMemo(() => ({
      id: `draw-selected-${drawMode.rect}`,
      display: (_, displayId) => CanvasUtil.drawSelected(
        drawMode.rect,
        spriteSheets[drawMode.source],
        displayId
      )
    }), [spriteSheets, drawMode]),
    onMove: (event, _, icon) => {
      const bounds = getBoundingBox({ event, rect: drawMode.rect });
      if (icon) {
        icon.style.opacity = contain(event.target, { in: bounds }) ? 1 : 0.5;
      }
    },
    onDownMove: (event) => {
      const bounds = getBoundingBox({ event, rect: drawMode.rect });
      if (contain(event.target, { in: bounds })) {
        dispatch(
          draw({
            event,
            selected: drawMode,
            transparent: spriteSheets[drawMode.source].transparent,
          })
        );
      }
    },
  });

  return children({
    register: {},
    connect: setup,
  });
}

export { DrawModeBehavior };
