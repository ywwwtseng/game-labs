import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { useSpriteSheets } from "@/context/SpriteSheetContext";
import { useCursor } from "@/hooks/useCursor";
import { drawTiles } from "@/features/appState/appStateSlice";
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
    onMove: (event, { iconEl }) => {
      if (iconEl) {
        iconEl.style.opacity = contain(iconEl, { in: event.target }) ? 1 : 0.5;
      }
    },
    onDownMove: (event, { iconEl }) => {
      if (contain(iconEl, { in: event.target })) {
        dispatch(
          drawTiles({
            event,
            selectedTiles: drawMode,
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
