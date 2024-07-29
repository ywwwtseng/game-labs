import { useCallback, useRef, useState } from "react";
import { produce } from "immer";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { BoundingBox } from "@/helpers/BoundingBox";

function useICanvasSelectArea({
  canvasId,
  draggable = false,
  draggedItem = {},
  source,
  selected,
  position,
  selectAreaStart,
  selectArea,
  selectAreaStop,
  setCursorPosition,
  onSelected = () => {},
}) {
  const ref = useRef();
  const { setData, handleMouseDown } = useDragAndDrop({
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
      if (draggable && pos.within && selected.index) {
        const [x, y, dx, dy] = CanvasUtil.rect(selected.index);
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

      const [x, y, dx, dy] = CanvasUtil.rect(selected.index);

      if (pos.within) {
        if (index[0] >= x && index[0] < x + dx) {
          if (index[1] >= y && index[1] < y + dy) {
            setData({ type: "tiles", source, selected: [x, y, dx, dy] });
            handleMouseDown(event);
            return;
          }
        }
      }
    }

    selectAreaStart(position ? [...position, 1, 1] : null);
  }, [draggable,selected, position]);

  const onMouseUp = useCallback(() => {
    selectAreaStop();
    onSelected(selected);
  }, [selected]);

  const onMouseLeave = useCallback((event) => {
    event.target.style.cursor = "default";
    setCursorPosition(null);
  }, []);

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
  canvasId,
  source,
  draggable,
  draggedItem = {},
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
