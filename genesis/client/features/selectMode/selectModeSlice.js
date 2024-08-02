import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { MatrixUtil } from "@/utils/MatrixUtil";
import { overlaps, contain } from "@/helpers/BoundingBox";

export const selectAreaStart = createAsyncThunk(
  "selectMode/selectAreaStart",
  async (payload, { dispatch }) => {
    dispatch(selectAreaStartProgcess(Boolean(payload)));
    dispatch(selectArea(payload));
  },
)

export const selectArea = createAsyncThunk(
  "selectMode/selectArea",
  async (payload, { getState, dispatch }) => {
    try {
      if (!payload) {
        dispatch(forceSelectArea({ default: null, follows: [] }));
        return;
      }

      const state = getState();
      const scene = state.appState.scene;
      const layer = scene.layers[scene.selectedLayerIndex];

      dispatch(forceSelectArea({
        default: payload,
        follows: Object.values(layer.patterns).map((pattern) => {
          const size = MatrixUtil.sizeIndex(pattern.tiles);
          return pattern.index.map(([x, y]) => {
            const rect = [x, y, ...size];
            if (overlaps(payload, rect) || contain(rect, { in: payload })) {
              return rect;
            }
          });
        }).flat()
      }));
    } catch (error) {
      console.log(error);
    }
  },
)

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
  name: "selectMode",
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
      state.selector.rect = [];
    },
  },
});

export const {
  setCursorIndex,
  selectAreaStartProgcess,
  forceSelectArea,
  selectAreaStop,
  destroy,
} = selectModeSlice.actions;

export const selectedCursorIndex = (state) => state.selectMode.selector.cursorIndex;
export const selectedSelectModeSeletor = (state) => state.selectMode.selector;
export const selectedSelectModeSeletorRect = (state) => state.selectMode.selector.rect;
export const selectedSelectModeSeletorRectDefault = (state) => state.selectMode.selector.rect.default;

export default selectModeSlice.reducer;
