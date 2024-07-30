import { useCallback, useRef, useState } from "react";
import { produce } from "immer";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { BoundingBox } from "@/helpers/BoundingBox";
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
  const moveDownCache = useRef(null);
  const isPressRef = useRef(false);
  const hasMoveDownBehaviorRef = useRef(false);
  const ref = useRef(null);
  const { dataTransfer, handleMouseDown } = useDragAndDrop({
    draggedItem,
    beforeDrop: (_, draggedEl) => {
      if (
        ref.current &&
        draggedEl &&
        new BoundingBox(ref.current).overlaps(new BoundingBox(draggedEl))
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
      const dx = index[0] - selected.index[0];
      const dy = index[1] - selected.index[1];

      selectArea([
        selected.index[0],
        selected.index[1],
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

        if (selected.index[0] !== indexX || selected.index[1] !== indexY) {
          const newSelectedIndex = CanvasUtil.calc([
            indexX,
            indexY,
            selected.index[2],
            selected.index[3],
          ], { limit: document.getElementById(canvasId) })

          selectArea(newSelectedIndex);
          onMoveDown({
            origin: selectedOrigin,
            next: newSelectedIndex,
          });
        }

      } else if (draggable && pos.within && selected.index) {
        const [x, y, dx, dy] = CanvasUtil.normalizeRect(selected.index);
        if (index[0] >= x && index[0] < x + dx) {
          if (index[1] >= y && index[1] < y + dy) {
            event.target.style.cursor = "pointer";
          }
        }
      }

      
    }
  }, [draggable, selected]);

  const onMouseDown = useCallback((event) => {
    if (draggable && selected.index) {
      const pos = CanvasUtil.getPosition(
        event,
        document.getElementById(canvasId)
      );

      const index = CanvasUtil.positionToIndex(pos);

      const [x, y, dx, dy] = CanvasUtil.normalizeRect(selected.index);

      if (pos.within) {
        if (index[0] >= x && index[0] < x + dx) {
          if (index[1] >= y && index[1] < y + dy) {
            isPressRef.current = true;
            const pos1 = CanvasUtil.getPosition(event, document.getElementById(canvasId));
            const pos0 = CanvasUtil.indexToPosition([x, y]);

            const vec = Vec2Util.calc(pos1, { sub: pos0 });
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
    if (isPressRef.current === true) {
      isPressRef.current = false;

      if (hasMoveDownBehaviorRef.current === true) {
        hasMoveDownBehaviorRef.current = false;
        onMoveDownEnd(event, selected);
      }
    }

    const normalizedSelectedIndex = selected.index ? CanvasUtil.normalizeRect(selected.index) : selected.index;

    selectArea(normalizedSelectedIndex);
    selectAreaStop();
    onSelected({
      ...selected,
      index: normalizedSelectedIndex,
    });
  }, [selected]);

  const onMouseLeave = useCallback((event) => {
    event.target.style.cursor = "default";
    setCursorPosition(null);

    if (selected.progress && selectedWhenMouseLeave) {
      const normalizedSelectedIndex = selected.index ? CanvasUtil.normalizeRect(selected.index) : selected.index;

      onSelected({
        ...selected,
        index: normalizedSelectedIndex,
      });
      selectArea(normalizedSelectedIndex);
      selectAreaStop();
    }

    
  }, [selected]);

  const onClick = useCallback((event) => {
    if (event.detail === 2) {
      if (selected.index) {
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
      selected: selected.index,
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
      index: defaultSelected,
    },
  });

  const selectArea = useCallback((index) => {
    setState(
      produce((draft) => {
        draft.selected.index = index;
      })
    );
  }, []);

  const selectAreaStart = useCallback((index) => {
    setState(
      produce((draft) => {
        draft.selected.progress = !!index;
        draft.selected.index = index;
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
