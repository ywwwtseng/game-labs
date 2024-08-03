import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { selectedScene } from '@/features/appState/appStateSlice';
import { CanvasUtil } from '@/utils/CanvasUtil';

export const selectAreaStart = createAsyncThunk(
  'selectMode/selectAreaStart',
  async (payload, { dispatch }) => {
    dispatch(selectAreaStartProgcess(Boolean(payload)));
    dispatch(selectArea({ default: payload }));
  },
);

export const selectArea = createAsyncThunk(
  'selectMode/selectArea',
  async (payload, { getState, dispatch }) => {
    const scene = selectedScene(getState());

    try {
      if (!payload.default) {
        dispatch(forceSelectArea({ default: null, follows: [] }));
        return;
      }

      dispatch(
        forceSelectArea({
          default: payload.default,
          follows: payload.follows || CanvasUtil.getFollowedSelectedPatterns(payload.default, scene),
        }),
      );
    } catch (error) {
      console.log(error);
    }
  },
);

const initialState = {
  selector: {
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
    setCursorIndex: (state, action) => {
      state.selector.cursorIndex = action.payload;
    },
    selectAreaStartProgcess: (state, action) => {
      state.selector.progress = action.payload;
    },
    forceSelectArea: (state, action) => {
      state.selector.rect = {
        default: action.payload.default || null,
        follows: action.payload.follows || [],
      };
    },
    selectAreaStop: (state) => {
      state.selector.progress = false;
    },
    destroy: (state) => {
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

export default selectModeSlice.reducer;
