import { createContext, useCallback, useReducer, useRef } from "react";
import { produce } from "immer";

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
      draft.dropzones = [ ...state.dropzones.filter(dropzone => dropzone.id !== action.payload) ];
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

  const setDragStop = (event) => {
    state.dropzones.forEach(({ accept, bounds, onDrop }) => {
      if (accept === ref.current.type) {
        if (event.pageX >= bounds.left && event.pageX <= bounds.right) {
          if (event.pageY >= bounds.top && event.pageY <= bounds.bottom) {
            if (onDrop) {
              onDrop(
                event,
                ref.current,
                {
                  x: event.pageX - bounds.x,
                  y: event.pageY - bounds.y
                }
              );
            }
          }
        }  
      }
    });
    
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
    addDropzone,
    removeDropzone,
  };

  return <DragAndDropContext.Provider value={value}>{children}</DragAndDropContext.Provider>;
};