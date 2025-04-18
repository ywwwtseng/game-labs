import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const KEEP_FOLLOWS = undefined;
export const SELECT_MODE = {
  OBJECT_2D_OR_TILE: 'OBJECT_2D_OR_TILE',
  OBJECT_2D: 'OBJECT_2D',
  TILE: 'TILE',
};

export const selectAreaStart = createAsyncThunk(
  'editMode/selectAreaStart',
  async (payload, { dispatch }) => {
    dispatch(selectAreaStartProgress(Boolean(payload)));
    dispatch(
      selectArea({
        default: payload,
        follows: [],
      })
    );
  }
);

export const selectArea = createAsyncThunk(
  'editMode/selectArea',
  async (payload, { getState, dispatch }) => {
    const state = getState();

    try {
      if (!payload.default) {
        dispatch(
          updateSelectAreaRects({
            mode: SELECT_MODE.OBJECT_2D_OR_TILE,
            default: null,
            follows: [],
          })
        );
        return;
      }

      dispatch(
        updateSelectAreaRects({
          mode: payload.mode || SELECT_MODE.OBJECT_2D_OR_TILE,
          default: payload.default,
          follows: payload.follows === KEEP_FOLLOWS ? selectedEditModeSelectorRectFollows(state) : payload.follows,
        })
      );
    } catch (error) {
      console.log(error);
    }
  }
);

const initialState = {
  selector: {
    mode: SELECT_MODE.OBJECT_2D_OR_TILE,
    cursorIndex: null,
    progress: false,
    rect: {
      default: null,
      follows: [],
    },
  },
};

export const editModeSlice = createSlice({
  name: 'editMode',
  initialState,
  reducers: {
    setCursorIndex: (state, action) => {
      // TODO: cause canvas rerender
      state.selector.cursorIndex = action.payload;
    },
    selectAreaStartProgress: (state, action) => {
      state.selector.progress = action.payload;
    },
    updateSelectAreaRects: (state, action) => {
      state.selector.mode = action.payload.mode;
      state.selector.rect = {
        default: action.payload.default || null,
        follows: action.payload.follows || [],
      };
    },
    selectAreaStop: (state) => {
      state.selector.progress = false;
    },
    selectAreaEnd: (state) => {
      state.selector.mode = SELECT_MODE.OBJECT_2D_OR_TILE;
      state.selector.rect = {
        default: null,
        follows: [],
      };
    },
    destroy: (state) => {
      state.selector.mode = SELECT_MODE.OBJECT_2D_OR_TILE;
      state.selector.rect = {
        default: null,
        follows: [],
      };
    },
  },
});

export const {
  setCursorIndex,
  selectAreaStartProgress,
  updateSelectAreaRects,
  selectAreaStop,
  selectAreaEnd,
  selectAreaDefault,
  destroy,
} = editModeSlice.actions;

export const selectedCursorIndex = (state) =>
  state.editMode.selector.cursorIndex;
export const selectedEditModeSelector = (state) => state.editMode.selector;
export const selectedEditModeSelectorRect = (state) =>
  state.editMode.selector.rect;
export const selectedEditModeSelectorMode = (state) => state.editMode.selector.mode;
export const selectedEditModeSelectorRectDefault = (state) =>
  state.editMode.selector.rect.default;
export const selectedEditModeSelectorRectFollows = (state) =>
  state.editMode.selector.rect.follows;

export const { reducer } = editModeSlice;
