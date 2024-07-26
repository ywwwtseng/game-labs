import { useCallback, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { MatrixUtil } from "@/utils/MatrixUtil";
import { BoundingBox } from "@/helpers/BoundingBox";
import { useSpriteSheets } from "@/context/SpriteSheetContext";
import { addSceneTile } from "@/features/appState/appStateSlice";

function DrawModeBehavior({ children }) {
  const cursorRef = useRef(null);
  const drawRef = useRef(null);
  const spriteSheets = useSpriteSheets();
  const drawMode = useSelector((state) => state.drawMode);
  const dispatch = useDispatch();

  // TODO:
  const draw = useCallback((event, selected) => {
    const [originX, originY, sizeIndexX, sizeIndexY] = selected.index;

    const sizeX = sizeIndexX * 16;
    const sizeY = sizeIndexY * 16;

    const pos = CanvasUtil.getPosition(event, event.target, {
      x: -(sizeX / 2),
      y: -(sizeY / 2),
    });

    MatrixUtil.traverse([sizeIndexX, sizeIndexY], (x, y) => {
      const index = CanvasUtil.positionToIndex(pos);
      dispatch(
        addSceneTile({
          index: [index[0] + x, index[1] + y],
          tile: {
            filename: selected.filename,
            index: [originX + x, originY + y],
          },
        })
      );
    });
  }, []);

  const onMouseMove = useCallback((event) => {
    if (!cursorRef.current) {
      cursorRef.current = CanvasUtil.drawSelected(drawMode.index, spriteSheets[drawMode.filename]);  
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
      draw(event, drawMode);
    }
  }, [drawMode]);

  const onMouseEnter = useCallback(() => {
    window.addEventListener('mousemove', onMouseMove);
  }, [drawMode]);

  const onMouseLeave = useCallback(() => {
    if (cursorRef.current) {
      cursorRef.current.remove();
      cursorRef.current = null;
    }
    window.removeEventListener('mousemove', onMouseMove);
  }, [drawMode]);

  const onMouseDown = useCallback((event) => {
    drawRef.current = true;
    draw(event, drawMode);
  }, [drawMode]);

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