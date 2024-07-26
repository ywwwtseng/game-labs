import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as selectModeActions from "@/features/selectMode/selectModeSlice";
import * as drawModeActions from "@/features/drawMode/drawModeSlice";
import { MODE } from "@/constants";

export const setMode = createAsyncThunk(
  "appState/setMode",
  async (
    { mode, payload },
    { getState, dispatch }) => {
      const lifecycle = {
        [MODE.SELECT]: selectModeActions,
        [MODE.DRAW]: drawModeActions,
      };

      const state = getState();
      const prevMode = state.appState.mode;

      if (prevMode !== mode) {
        const destroy = lifecycle[prevMode]?.destroy;

        if (destroy) {
          dispatch(destroy());
        }
      }

      const init = lifecycle[mode]?.init

      if (init) {
        dispatch(init(payload));
      }

      return mode;
  }
);

const initialState = {
  mode: MODE.SELECT,
  cursor: {
    position: null,
  },
  // scene: undefined
  scene: {
    name: "default",
    width: 512,
    height: 512,
    selectedLayerIndex: 0,
    layers: [
      {
        tiles: [],
      },
    ],
  },
};

export const appStateSlice = createSlice({
  name: "appState",
  initialState,
  reducers: {
    setCursorPosition: (state, action) => {
      state.cursor.position = action.payload;
    },
    addScene: (state, action) => {
      state.scene = { ...state.scene, ...action.payload };
    },
    addSceneTile: (state, action) => {
      const layerIndex = state.scene.selectedLayerIndex;
      const [indexX, indexY] = action.payload.index;
      const tile = action.payload.tile;

      if (!state.scene.layers[layerIndex].tiles[indexX]) {
        state.scene.layers[layerIndex].tiles[indexX] = [];
      }
      state.scene.layers[layerIndex].tiles[indexX][indexY] = tile;
    },
    addLayer: (state) => {
      state.scene.layers.push({ tiles: [] });
    },
    selectLayer: (state, action) => {
      state.scene.selectedLayerIndex = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setMode.fulfilled, (state, action) => {
      state.mode = action.payload;
    });
  },
});

export const {
  setCursorPosition,
  addScene,
  addSceneTile,
  addLayer,
  selectLayer,
} = appStateSlice.actions;

export default appStateSlice.reducer;
