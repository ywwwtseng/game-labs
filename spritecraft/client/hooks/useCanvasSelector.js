import { useCallback, useState } from 'react';
import { produce } from 'immer';
import { CanvasUtil } from '@/utils/CanvasUtil';

function useCanvasSelectorWoState({
  canvasId,
  draggable = false,
  selected,
  select,
  location,
  selectStart,
  selectStop,
  setLocation,
}) {
  const onMouseMove = (event) => {
    event.target.style.cursor = 'default';
    const pos = CanvasUtil.getPositionInCanvas(
      event,
      document.getElementById(canvasId),
    );

    const index = CanvasUtil.positionToIndex(pos);

    if (pos.within) {
      setLocation([
        index.x,
        index.y,
      ]);
    }

    if (selected.progress) {
      const dx = index.x - selected.index[0];
      const dy = index.y - selected.index[1];
      
      select([
        selected.index[0],
        selected.index[1],
        dx > 0 ? dx + 1 : dx === 0 ? 1 : dx - 1,
        dy > 0 ? dy + 1 : dy === 0 ? 1 : dy - 1,
      ]);
    } else {
      if (draggable && selected.index) {
        const [x, y, dx, dy] = CanvasUtil.rect(selected.index);
        if (index.x >= x && index.x < x + dx) {
          if (index.y >= y && index.y < y + dy) {
            event.target.style.cursor = 'pointer';
          }
        }
      }
    }
  };

  const onMouseDown = () => {
    selectStart(location ? [...location, 1, 1] : null);
  };

  const onMouseUp = () => {
    selectStop();
  };

  const onMouseLeave = () => {
    setLocation(null)
  };

  return {
    selected,
    location,
    register: {
      onMouseMove,
      onMouseDown,
      onMouseUp,
    },
    connect: {
      onMouseLeave
    },
  }
}

function useCanvasSelector({ canvasId, draggable }) {
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
    draggable,
    selected: state.selected,
    location: state.location,
    select: select,
    selectStart: selectStart,
    selectStop: selectStop,
    setLocation: setLocation,
  });
}

export { useCanvasSelector, useCanvasSelectorWoState };