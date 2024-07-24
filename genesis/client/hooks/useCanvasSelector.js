import { useCallback, useRef, useState } from "react";
import { produce } from "immer";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { useDraggable } from "@/hooks/useDraggable";
import { BoundingBox } from "@/helpers/BoundingBox";

function useCanvasSelectorWoState({
  canvasId,
  draggable = false,
  draggedItem = {},
  filename,
  selected,
  select,
  location,
  selectStart,
  selectStop,
  setLocation,
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
      setLocation(index);
    }

    if (selected.progress) {
      const dx = index[0] - selected.index[0];
      const dy = index[1] - selected.index[1];

      select([
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

    selectStart(location ? [...location, 1, 1] : null);
  };

  const onMouseUp = () => {
    selectStop();
  };

  const onMouseLeave = (event) => {
    event.target.style.cursor = "default";
    setLocation(null);
  };

  return {
    selected,
    location,
    register: {
      ref,
      onMouseMove,
      onMouseDown,
      onMouseUp,
    },
    connect: {
      onMouseLeave,
    },
  };
}

function useCanvasSelector({
  canvasId,
  filename,
  draggable,
  draggedItem = {},
}) {
  const [state, setState] = useState({
    location: null,
    selected: {
      progress: false,
      index: null,
    },
  });

  const select = useCallback((index) => {
    setState(
      produce((draft) => {
        draft.selected.index = index;
      })
    );
  }, []);

  const selectStart = useCallback((index) => {
    setState(
      produce((draft) => {
        draft.selected.progress = !!index;
        draft.selected.index = index;
      })
    );
  }, []);

  const selectStop = useCallback(() => {
    setState(
      produce((draft) => {
        draft.selected.progress = false;
      })
    );
  }, []);

  const setLocation = useCallback((location) => {
    setState(
      produce((draft) => {
        draft.location = location;
      })
    );
  }, []);

  return useCanvasSelectorWoState({
    canvasId,
    filename,
    draggable,
    draggedItem,
    selected: state.selected,
    location: state.location,
    select: select,
    selectStart: selectStart,
    selectStop: selectStop,
    setLocation: setLocation,
  });
}

export { useCanvasSelector, useCanvasSelectorWoState };
