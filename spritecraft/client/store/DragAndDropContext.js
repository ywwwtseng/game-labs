import { createContext, useReducer, useRef } from "react";
import { produce } from "immer";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { BoundingBox } from "@/helpers/BoundingBox";

const INITIAL_STATE = {
  draggable: false,
  dropzones: [],
};

const ACTIONS = {
  DRAG_START: "DRAG_START",
  DRAG_STOP: "DRAG_STOP",
  ADD_DROPZONE: "SET_DROPZONE",
  REMOVE_DROPZONE: "SET_DROPZONE",
};

const reducer = produce((draft, action) => {
  switch (action.type) {
    case ACTIONS.DRAG_START:
      draft.draggable = true;
      break;
    case ACTIONS.DRAG_STOP:
      draft.draggable = false;
      break;
    case ACTIONS.ADD_DROPZONE:
      draft.dropzones.push(action.payload);
      break;
    case ACTIONS.REMOVE_DROPZONE:
      draft.dropzones = [
        ...state.dropzones.filter((dropzone) => dropzone.id !== action.payload),
      ];
      break;
    default:
      break;
  }
});

export const DragAndDropContext = createContext(INITIAL_STATE);

export const DragAndDropProvider = ({ children }) => {
  const ref = useRef(null);
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const setDragStart = (item) => {
    ref.current = item;
    dispatch({ type: ACTIONS.DRAG_START });
  };

  const onDrop = (event) => {
    state.dropzones.forEach(({ accept, el, onDrop }) => {
      if (ref.current && accept === ref.current.type) {
        const sizeX = ref.current.selected[2] * 16;
        const sizeY = ref.current.selected[3] * 16;

        const leftTopPos = CanvasUtil.getPosition(event, el, {
          x: -(sizeX / 2),
          y: -(sizeY / 2),
        });

        const rightBottomPos = CanvasUtil.getPosition(event, el, {
          x: (sizeX / 2) - 8,
          y: (sizeY / 2) - 8,
        });

        if (leftTopPos.within && rightBottomPos.within && onDrop) {
          onDrop(event, ref.current, CanvasUtil.positionToIndex(leftTopPos));
        }
      }
    });
  };

  const setDragStop = () => {
    dispatch({ type: ACTIONS.DRAG_STOP });
    ref.current = null;
  };

  const addDropzone = (dropzone) => {
    dispatch({ type: ACTIONS.ADD_DROPZONE, payload: dropzone });
  };

  const removeDropzone = (id) => {
    dispatch({ type: ACTIONS.REMOVE_DROPZONE, payload: id });
  };

  const value = {
    draggable: state.draggable,
    setDragStart,
    setDragStop,
    onDrop,
    addDropzone,
    removeDropzone,
  };

  return (
    <DragAndDropContext.Provider value={value}>
      {children}
    </DragAndDropContext.Provider>
  );
};
