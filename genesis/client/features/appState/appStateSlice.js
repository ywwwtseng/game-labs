import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as selectModeActions from "@/features/selectMode/selectModeSlice";
import * as drawModeActions from "@/features/drawMode/drawModeSlice";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { MatrixUtil } from "@/utils/MatrixUtil";
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

export const draw = createAsyncThunk(
  "appState/draw",
  async ({ event, selected, transparent = [] }, { getState, dispatch }) => {
    try {
      const scene = getState().appState.scene;
      const layer = scene.layers[scene.selectedLayerIndex];

      const [originX, originY, sizeIndexX, sizeIndexY] = selected.index;

      const sizeX = sizeIndexX * 16;
      const sizeY = sizeIndexY * 16;

      const pos = CanvasUtil.getPosition(event, event.target, {
        x: -(sizeX / 2) + 8,
        y: -(sizeY / 2) + 8,
      });

      const index = CanvasUtil.positionToIndex(pos);
      const canvasMaxIndex = CanvasUtil.positionToIndex({
        x: scene.width,
        y: scene.height,
      });

      if (
        index[0] + sizeIndexX - 1 > canvasMaxIndex[0] ||
        index[1] + sizeIndexY - 1 > canvasMaxIndex[1]
      ) {
        console.log('dsfsd')
        return;
      }

      for (let x = 0; x < sizeIndexX; x++) {
        for (let y = 0; y < sizeIndexY; y++) {
          if (
            layer.tiles?.[index[0] + x]?.[index[1] + y] &&
            !transparent.includes(`${originX + x}.${originY + y}`)
          ) {
            console.log('dsfsd')
            return;
          }
        }
      }

      MatrixUtil.traverse([sizeIndexX, sizeIndexY], (x, y) => {
        if (!transparent.includes(`${originX + x}.${originY + y}`)) {
          dispatch(
            addSceneTile({
              index: [index[0] + x, index[1] + y],
              tile: {
                path: selected.path,
                index: [originX + x, originY + y],
              },
            })
          );
        }
      });
    } catch (error) {
      console.log(error);
    }
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
