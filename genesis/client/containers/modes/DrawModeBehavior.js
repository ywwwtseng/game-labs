import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { BoundingBox } from "@/helpers/BoundingBox";
import { useSpriteSheets } from "@/context/SpriteSheetContext";
import { draw } from "@/features/appState/appStateSlice";

function DrawModeBehavior({ children }) {
  const cursorRef = useRef(null);
  const drawRef = useRef(null);
  const spriteSheets = useSpriteSheets();
  const drawMode = useSelector((state) => state.drawMode);
  const dispatch = useDispatch();

  const onMouseMove = useCallback(
    (event) => {
      if (!cursorRef.current) {
        cursorRef.current = CanvasUtil.drawSelected(
          drawMode.index,
          spriteSheets[drawMode.path]
        );
        document.body.append(cursorRef.current);
      }

      const bounds = new BoundingBox(cursorRef.current);
      const position = {
        x: event.pageX - bounds.size.x / 2,
        y: event.pageY - bounds.size.y / 2,
      };
      cursorRef.current.style.left = `${position.x}px`;
      cursorRef.current.style.top = `${position.y}px`;
      cursorRef.current.style.pointerEvents = "none";
      cursorRef.current.style.position = "fixed";
      cursorRef.current.style.zIndex = 9999;

      if (drawRef.current) {
        dispatch(
          draw({
            event,
            selected: drawMode,
            transparent: spriteSheets[drawMode.path].transparent,
          })
        );
      }
    },
    [drawMode, spriteSheets]
  );

  const onMouseEnter = useCallback(() => {
    window.addEventListener("mousemove", onMouseMove);
  }, [drawMode]);

  const onMouseLeave = useCallback(() => {
    if (cursorRef.current) {
      cursorRef.current.remove();
      cursorRef.current = null;
    }
    window.removeEventListener("mousemove", onMouseMove);
  }, [drawMode, spriteSheets]);

  const onMouseDown = useCallback(
    (event) => {
      drawRef.current = true;
      dispatch(
        draw({
          event,
          selected: drawMode,
          transparent: spriteSheets[drawMode.path].transparent,
        })
      );
    },
    [drawMode, spriteSheets]
  );

  const onMouseUp = useCallback(() => {
    drawRef.current = false;
  }, [drawMode]);

  return children({
    register: {},
    connect: {
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
    },
  });
}

export { DrawModeBehavior };
