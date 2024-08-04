import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { selectedScene } from '@/features/appState/appStateSlice';

export const KEEP_FOLLOWS = undefined;
export const SELECT_MODE = {
  PATTERN_OR_TILE: 'PATTERN_OR_TILE',
  PATTERN: 'PATTERN',
  TILE: 'TILE',
};

export const selectAreaStart = createAsyncThunk(
  'selectMode/selectAreaStart',
  async (payload, { dispatch }) => {
    dispatch(selectAreaStartProgcess(Boolean(payload)));
    dispatch(
      selectArea({
        default: payload,
        follows: [],
      })
    );
  }
);

export const selectArea = createAsyncThunk(
  'selectMode/selectArea',
  async (payload, { getState, dispatch }) => {
    const state = getState();
    const scene = selectedScene(state);

    try {
      if (!payload.default) {
        dispatch(
          forceSelectArea({
            mode: SELECT_MODE.PATTERN_OR_TILE,
            default: null,
            follows: [],
          })
        );
        return;
      }

      dispatch(
        forceSelectArea({
          mode: payload.mode || SELECT_MODE.PATTERN_OR_TILE,
          default: payload.default,
          follows:  payload.follows === KEEP_FOLLOWS ? selectedSelectModeSeletorRectFollows(state) : payload.follows,
        })
      );
    } catch (error) {
      console.log(error);
    }
  }
);

const initialState = {
  selector: {
    mode: SELECT_MODE.PATTERN_OR_TILE,
    cursorIndex: null,
    progress: false,
    rect: {
      default: null,
      follows: [],
    },
  },
};

export const selectModeSlice = createSlice({
  name: 'selectMode',
  initialState,
  reducers: {
    selectAreaStartEnd: () => {},
    setCursorIndex: (state, action) => {
      state.selector.cursorIndex = action.payload;
    },
    selectAreaStartProgcess: (state, action) => {
      state.selector.progress = action.payload;
    },
    forceSelectArea: (state, action) => {
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
      state.selector.mode = SELECT_MODE.PATTERN_OR_TILE;
      state.selector.rect = {
        default: null,
        follows: [],
      };
    },
    destroy: (state) => {
      state.selector.mode = SELECT_MODE.PATTERN_OR_TILE;
      state.selector.rect = {
        default: null,
        follows: [],
      };
    },
  },
});

export const {
  setCursorIndex,
  selectAreaStartProgcess,
  forceSelectArea,
  selectAreaStop,
  selectAreaDefault,
  destroy,
} = selectModeSlice.actions;

export const selectedCursorIndex = (state) =>
  state.selectMode.selector.cursorIndex;
export const selectedSelectModeSeletor = (state) => state.selectMode.selector;
export const selectedSelectModeSeletorRect = (state) =>
  state.selectMode.selector.rect;
export const selectedSelectModeSeletorRectDefault = (state) =>
  state.selectMode.selector.rect.default;
export const selectedSelectModeSeletorRectFollows = (state) =>
  state.selectMode.selector.rect.follows;

export default selectModeSlice.reducer;
