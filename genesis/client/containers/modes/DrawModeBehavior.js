import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { BoundingBox } from "@/helpers/BoundingBox";
import { useSpriteSheets } from "@/context/SpriteSheetContext";
import { useCursor } from "@/hooks/useCursor";
import { draw } from "@/features/appState/appStateSlice";

function DrawModeBehavior({ children }) {
  const drawRef = useRef(null);
  const spriteSheets = useSpriteSheets();
  const drawMode = useSelector((state) => state.drawMode);
  const dispatch = useDispatch();

  const { setup } = useCursor({
    display: () => CanvasUtil.drawSelected(
      drawMode.rect,
      spriteSheets[drawMode.source]
    ),
    onDownMove: (event) => {
      dispatch(
        draw({
          event,
          selected: drawMode,
          transparent: spriteSheets[drawMode.source].transparent,
        })
      );
    },
  });

  return children({
    register: {},
    connect: setup,
  });
}

export { DrawModeBehavior };
