import { createSlice } from "@reduxjs/toolkit";
import { MODE } from "@/constants";

const initialState = {
  mode: MODE.SELECT,
  cursor: {
    poistion: null,
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
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setCursorPosition: (state, action) => {
      state.cursor.poistion = action.payload;
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
});

export const {
  setMode,
  setCursorPosition,
  addScene,
  addSceneTile,
  addLayer,
  selectLayer,
} = appStateSlice.actions;

export default appStateSlice.reducer;
