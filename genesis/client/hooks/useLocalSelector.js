import { useCallback, useState } from 'react';
import { produce } from 'immer';
import { useSelectorBridge } from '@/hooks/useSelectorBridge';

function useLocalSelector({
  defaultSelected = null,
  selectedWhenMouseLeave,
  canvasId,
  draggable = false,
  dragAndDrop = false,
  icon = null,
  onSelected = () => {},
}) {
  const [state, setState] = useState({
    cursorIndex: null,
    progress: false,
    rect: {
      default: defaultSelected,
    },
  });

  const selectAreaStart = useCallback((rect) => {
    setState(
      produce((draft) => {
        draft.progress = Boolean(rect);
      }),
    );

    selectArea({ default: rect });
  }, []);

  const selectArea = useCallback((rect) => {
    setState(
      produce((draft) => {
        draft.rect.default = rect.default;
      }),
    );
  }, []);

  const selectAreaStop = useCallback(() => {
    setState(
      produce((draft) => {
        draft.progress = false;
      }),
    );
  }, []);

  const setCursorIndex = useCallback((cursorIndex) => {
    setState(
      produce((draft) => {
        draft.cursorIndex = cursorIndex;
      }),
    );
  }, []);

  return useSelectorBridge({
    canvasId,
    selectedWhenMouseLeave,
    draggable,
    icon,
    selector: state,
    cursorIndex: state.cursorIndex,
    dragAndDrop,
    selectArea,
    selectAreaStart,
    selectAreaStop,
    setCursorIndex,
    onSelected,
  });
}

export { useLocalSelector };
