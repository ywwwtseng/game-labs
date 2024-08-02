import { useCallback, useRef } from "react";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { overlaps } from "@/helpers/BoundingBox";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { Vec2Util } from "@/utils/Vec2Util";

function useSelectorBridge({
  canvasId,
  selectedWhenMouseLeave,
  draggable = false,
  draggedItem = null,
  selector,
  cursorIndex,
  selectAreaStart,
  selectArea,
  selectAreaStop,
  setCursorIndex,
  onMoveDown = () => {},
  onMoveDownEnd = () => {},
  onSelected = () => {},
}) {
  const isPressRef = useRef(false);
  const hasMoveDownBehaviorRef = useRef(false);
  const ref = useRef(null);
  const { dataTransfer, handleMouseDown } = useDragAndDrop({
    draggedItem,
    beforeDrop: (_, draggedEl) => {
      if (
        ref.current &&
        draggedEl &&
        overlaps(ref.current, draggedEl)
      ) {
        return false;
      }

      return true;
    },
  });

  const onMouseMove = useCallback((event) => {
    event.target.style.cursor = "default";
    const pos = CanvasUtil.getPosition(
      event,
      document.getElementById(canvasId)
    );

    const index = CanvasUtil.positionToIndex(pos);

    if (pos.within) {
      setCursorIndex(index);
    }

    if (selector.progress && selector.rect.default) {
      const dx = index[0] - selector.rect.default[0];
      const dy = index[1] - selector.rect.default[1];

      selectArea([
        selector.rect.default[0],
        selector.rect.default[1],
        dx > 0 ? dx + 1 : dx === 0 ? 1 : dx - 1,
        dy > 0 ? dy + 1 : dy === 0 ? 1 : dy - 1,
      ]);
    } else {
      if (isPressRef.current === true) {
        event.target.style.cursor = "pointer";
        hasMoveDownBehaviorRef.current = true;
        const { vec, selector: selectedOrigin } = dataTransfer.getData();
        const pos0 = CanvasUtil.getPosition(event, document.getElementById(canvasId));
        const pos = Vec2Util.calc(pos0, { sub: vec });

        const [indexX, indexY] = CanvasUtil.positionToIndex(pos);

        if (selector.rect.default[0] !== indexX || selector.rect.default[1] !== indexY) {
          const newSelectedRect = CanvasUtil.calc([
            indexX,
            indexY,
            selector.rect.default[2],
            selector.rect.default[3],
          ], { limit: document.getElementById(canvasId) })

          selectArea(newSelectedRect);
          onMoveDown({
            origin: selectedOrigin,
            next: newSelectedRect,
          });
        }

      } else if (draggable && pos.within && selector.rect.default) {
        const [x, y, dx, dy] = CanvasUtil.normalizeRect(selector.rect.default);
        if (index[0] >= x && index[0] < x + dx) {
          if (index[1] >= y && index[1] < y + dy) {
            event.target.style.cursor = "pointer";
          }
        }
      }

      
    }
  }, [draggable, selector]);

  const onMouseDown = useCallback((event) => {
    if (draggable && selector.rect.default) {
      const pos = CanvasUtil.getPosition(
        event,
        document.getElementById(canvasId)
      );

      const index = CanvasUtil.positionToIndex(pos);

      const [x, y, dx, dy] = CanvasUtil.normalizeRect(selector.rect.default);

      if (pos.within) {
        if (index[0] >= x && index[0] < x + dx) {
          if (index[1] >= y && index[1] < y + dy) {
            isPressRef.current = true;
            const pos1 = CanvasUtil.getPosition(event, document.getElementById(canvasId));
            const pos0 = CanvasUtil.indexToPosition([x, y]);

            const vec = Vec2Util.calc(pos1, { sub: Vec2Util.calc(pos0, { add: { x: 1,y: 1 }})});
            dataTransfer.setData({ type: "tiles", selector: [x, y, dx, dy], vec });
            handleMouseDown(event);
            return;
          }
        }
      }
    }

    selectAreaStart(cursorIndex ? [...cursorIndex, 1, 1] : null);
  }, [draggable, selector, cursorIndex]);

  const onMouseUp = useCallback((event) => {
    dataTransfer.setData(null);

    const selectedDefaultRect = CanvasUtil.normalizeRect(selector.rect.default);
    selectArea(selectedDefaultRect);
    selectAreaStop();
    onSelected({
      default: selectedDefaultRect,
    });


    if (isPressRef.current === true) {
      isPressRef.current = false;

      if (hasMoveDownBehaviorRef.current === true) {
        hasMoveDownBehaviorRef.current = false;
        onMoveDownEnd(event, selector);
      }
    }    
  }, [selector]);

  const onMouseLeave = useCallback((event) => {
    event.target.style.cursor = "default";
    setCursorIndex(null);

    if (selector.progress && selectedWhenMouseLeave) {
      const selectedDefaultRect = CanvasUtil.normalizeRect(selector.rect.default);

      onSelected({
        default: selectedDefaultRect,
      });
      selectArea(selectedDefaultRect);
      selectAreaStop();
    }

    
  }, [selector]);

  const onClick = useCallback((event) => {
    if (event.detail === 2) {
      if (selector.rect.default) {
        onSelected({
          default: null,
        })
        selectAreaStart([]);
      }
    }
  }, [selector]);

  return {
    selector,
    cursorIndex,
    register: {
      ref,
      onMouseMove,
      onMouseDown,
      onMouseUp,
      onClick,
    },
    connect: {
      onMouseLeave,
    },
  };
}

export { useSelectorBridge };
