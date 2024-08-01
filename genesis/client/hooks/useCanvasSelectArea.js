import { useCallback, useRef, useState } from "react";
import { produce } from "immer";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { overlaps } from "@/helpers/BoundingBox";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { Vec2Util } from "@/utils/Vec2Util";

function useICanvasSelectArea({
  canvasId,
  selectedWhenMouseLeave,
  draggable = false,
  draggedItem = null,
  source,
  selected,
  position,
  selectAreaStart,
  selectArea,
  selectAreaStop,
  setCursorPosition,
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
      setCursorPosition(index);
    }

    if (selected.progress) {
      const dx = index[0] - selected.rect[0];
      const dy = index[1] - selected.rect[1];

      selectArea([
        selected.rect[0],
        selected.rect[1],
        dx > 0 ? dx + 1 : dx === 0 ? 1 : dx - 1,
        dy > 0 ? dy + 1 : dy === 0 ? 1 : dy - 1,
      ]);
    } else {
      if (isPressRef.current === true) {
        event.target.style.cursor = "pointer";
        hasMoveDownBehaviorRef.current = true;
        const { vec, selected: selectedOrigin } = dataTransfer.getData();
        const pos0 = CanvasUtil.getPosition(event, document.getElementById(canvasId));
        const pos = Vec2Util.calc(pos0, { sub: vec });

        const [indexX, indexY] = CanvasUtil.positionToIndex(pos);

        if (selected.rect[0] !== indexX || selected.rect[1] !== indexY) {
          const newSelectedRect = CanvasUtil.calc([
            indexX,
            indexY,
            selected.rect[2],
            selected.rect[3],
          ], { limit: document.getElementById(canvasId) })

          selectArea(newSelectedRect);
          onMoveDown({
            origin: selectedOrigin,
            next: newSelectedRect,
          });
        }

      } else if (draggable && pos.within && selected.rect) {
        const [x, y, dx, dy] = CanvasUtil.normalizeRect(selected.rect);
        if (index[0] >= x && index[0] < x + dx) {
          if (index[1] >= y && index[1] < y + dy) {
            event.target.style.cursor = "pointer";
          }
        }
      }

      
    }
  }, [draggable, selected]);

  const onMouseDown = useCallback((event) => {
    if (draggable && selected.rect) {
      const pos = CanvasUtil.getPosition(
        event,
        document.getElementById(canvasId)
      );

      const index = CanvasUtil.positionToIndex(pos);

      const [x, y, dx, dy] = CanvasUtil.normalizeRect(selected.rect);

      if (pos.within) {
        if (index[0] >= x && index[0] < x + dx) {
          if (index[1] >= y && index[1] < y + dy) {
            isPressRef.current = true;
            const pos1 = CanvasUtil.getPosition(event, document.getElementById(canvasId));
            const pos0 = CanvasUtil.indexToPosition([x, y]);

            const vec = Vec2Util.calc(pos1, { sub: Vec2Util.calc(pos0, { add: { x: 1,y: 1 }})});
            dataTransfer.setData({ type: "tiles", source, selected: [x, y, dx, dy], vec });
            handleMouseDown(event);
            return;
          }
        }
      }
    }

    selectAreaStart(position ? [...position, 1, 1] : null);
  }, [draggable, selected, position]);

  const onMouseUp = useCallback((event) => {
    dataTransfer.setData(null);

    const normalizedSelectedRect = selected.rect ? CanvasUtil.normalizeRect(selected.rect) : selected.rect;
    selectArea(normalizedSelectedRect);
    selectAreaStop();
    onSelected({
      rect: normalizedSelectedRect,
    });


    if (isPressRef.current === true) {
      isPressRef.current = false;

      if (hasMoveDownBehaviorRef.current === true) {
        hasMoveDownBehaviorRef.current = false;
        onMoveDownEnd(event, selected);
      }
    }    
  }, [selected]);

  const onMouseLeave = useCallback((event) => {
    event.target.style.cursor = "default";
    setCursorPosition(null);

    if (selected.progress && selectedWhenMouseLeave) {
      const normalizedSelectedRect = selected.rect ? CanvasUtil.normalizeRect(selected.rect) : selected.rect;

      onSelected({
        rect: normalizedSelectedRect,
      });
      selectArea(normalizedSelectedRect);
      selectAreaStop();
    }

    
  }, [selected]);

  const onClick = useCallback((event) => {
    if (event.detail === 2) {
      if (selected.rect) {
        onSelected({
          rect: null,
        })
        selectAreaStart(null);
      }
    }
  }, [selected]);

  return {
    selected,
    position,
    register: {
      ref,
      onMouseMove,
      onMouseDown,
      onMouseUp,
      onClick,
    },
    connect: {
      selected: selected.rect,
      onMouseLeave,
    },
  };
}

function useCanvasSelectArea({
  defaultSelected = null,
  selectedWhenMouseLeave = false,
  canvasId,
  source,
  draggable = false,
  draggedItem = null,
  onSelected = () => {},
}) {
  const [state, setState] = useState({
    cursor: {
      position: null,
    },
    selected: {
      progress: false,
      rect: defaultSelected,
    },
  });

  const selectArea = useCallback((rect) => {
    setState(
      produce((draft) => {
        draft.selected.rect = rect;
      })
    );
  }, []);

  const selectAreaStart = useCallback((rect) => {
    setState(
      produce((draft) => {
        draft.selected.progress = !!rect;
        draft.selected.rect = rect;
      })
    );
  }, []);

  const selectAreaStop = useCallback(() => {
    setState(
      produce((draft) => {
        draft.selected.progress = false;
      })
    );
  }, []);

  const setCursorPosition = useCallback((position) => {
    setState(
      produce((draft) => {
        draft.cursor.position = position;
      })
    );
  }, []);

  return useICanvasSelectArea({
    canvasId,
    selectedWhenMouseLeave,
    source,
    draggable,
    draggedItem,
    selected: state.selected,
    position: state.cursor.position,
    selectArea,
    selectAreaStart,
    selectAreaStop,
    setCursorPosition,
    onSelected,
  });
}

export { useCanvasSelectArea, useICanvasSelectArea };
