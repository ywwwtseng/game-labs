import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { MatrixUtil } from "@/utils/MatrixUtil";
import { overlaps, contain } from "@/helpers/BoundingBox";

export const selectAreaStart = createAsyncThunk(
  "selectMode/selectAreaStart",
  async (payload, { dispatch }) => {
    dispatch(_selectAreaStart(payload));
    dispatch(forceSelectArea(payload));
  },
)

export const selectArea = createAsyncThunk(
  "selectMode/selectAreaStart",
  async (payload, { getState, dispatch }) => {
    try {
      if (!payload) {
        dispatch(forceSelectArea([]));
      }

      const state = getState();
      const scene = state.appState.scene;
      const layer = scene.layers[scene.selectedLayerIndex];

      dispatch(forceSelectArea([
        payload,
        ...Object.values(layer.patterns).map((pattern) => {
          const size = MatrixUtil.sizeIndex(pattern.tiles);
          return pattern.index.map(([x, y]) => {
            const rect = [x, y, ...size];
            if (overlaps(payload, rect) || contain(rect, { in: payload })) {
              return rect;
            }
          });
        }).flat()
      ]));
    } catch (error) {
      console.log(error);
    }
  },
)

const initialState = {
  cursor: {
    position: null,
  },
  selected: {
    progress: false,
    rect: [],
  },
};

export const selectModeSlice = createSlice({
  name: "selectMode",
  initialState,
  reducers: {
    setCursorPosition: (state, action) => {
      state.cursor.position = action.payload;
    },
    _selectAreaStart: (state, action) => {
      state.selected.progress = Boolean(action.payload);
    },
    forceSelectArea: (state, action) => {
      state.selected.rect = action.payload || [];
    },
    selectAreaStop: (state) => {
      state.selected.progress = false;
    },
    destroy: (state) => {
      state.selected.rect = [];
    },
  },
});

export const {
  setCursorPosition,
  _selectAreaStart,
  forceSelectArea,
  selectAreaStop,
  destroy,
} = selectModeSlice.actions;

export const selectedUserSelectedState = (state) => state.selectMode.selected;
export const selectedUserSelectedRect = (state) => state.selectMode.selected.rect[0];
export const selectedSelectedRectList = (state) => {
  const [user, ...patterns] = state.selectMode.selected.rect;
  return {
    user,
    patterns: patterns.filter(Boolean)
  }
};

export default selectModeSlice.reducer;
