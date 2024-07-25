import { useCallback, useRef, useState } from "react";
import { produce } from "immer";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { useDraggable } from "@/hooks/useDraggable";
import { BoundingBox } from "@/helpers/BoundingBox";

function useICanvasSelectArea({
  canvasId,
  draggable = false,
  draggedItem = {},
  filename,
  selected,
  poistion,
  selectAreaStart,
  selectArea,
  selectAreaStop,
  setCursorPosition,
}) {
  const ref = useRef();
  const { setData, handleMouseDown } = useDraggable({
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
  const onMouseMove = (event) => {
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
  };

  const onMouseDown = (event) => {
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
            setData({ type: "tiles", filename, selected: [x, y, dx, dy] });
            handleMouseDown(event);
            return;
          }
        }
      }
    }

    selectAreaStart(poistion ? [...poistion, 1, 1] : null);
  };

  const onMouseUp = () => {
    selectAreaStop();
  };

  const onMouseLeave = (event) => {
    event.target.style.cursor = "default";
    setCursorPosition(null);
  };

  const onClick = (event) => {
    if (event.detail === 2) {
      if (selected.index) {
        selectAreaStart(null);
      }
    }
  };

  return {
    selected,
    poistion,
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
  canvasId,
  filename,
  draggable,
  draggedItem = {},
}) {
  const [state, setState] = useState({
    cursor: {
      poistion: null,
    },
    selected: {
      progress: false,
      index: null,
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

  const setCursorPosition = useCallback((poistion) => {
    setState(
      produce((draft) => {
        draft.cursor.poistion = poistion;
      })
    );
  }, []);

  return useICanvasSelectArea({
    canvasId,
    filename,
    draggable,
    draggedItem,
    selected: state.selected,
    poistion: state.cursor.poistion,
    selectArea,
    selectAreaStart,
    selectAreaStop,
    setCursorPosition,
  });
}

export { useCanvasSelectArea, useICanvasSelectArea };
