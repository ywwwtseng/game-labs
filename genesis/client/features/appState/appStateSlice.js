import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as selectModeActions from "@/features/selectMode/selectModeSlice";
import * as drawModeActions from "@/features/drawMode/drawModeSlice";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { MatrixUtil } from "@/utils/MatrixUtil";
import { MODE } from "@/constants";
import { Vec2Util } from "@/utils/Vec2Util";

export const setMode = createAsyncThunk(
  "appState/setMode",
  async ({ mode, payload }, { getState, dispatch }) => {
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

    const init = lifecycle[mode]?.init;

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

      const [originX, originY, sizeIndexX, sizeIndexY] = selected.rect;

      const sizeX = sizeIndexX * 16;
      const sizeY = sizeIndexY * 16;

      const pos = Vec2Util.calc(CanvasUtil.getPosition(event, event.target), {
        add: { x: -(sizeX / 2) + 8, y: -(sizeY / 2) + 8 },
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
        return;
      }

      dispatch(
        addTilesToScene({
          selectedArea: [index[0], index[1], sizeIndexX, sizeIndexY],
          firstTileOriginInSprite: [originX, originY],
          transparent,
          source: selected.source,
        })
      );
    } catch (error) {
      console.log(error);
    }
  }
);

export const moveSceneTiles = createAsyncThunk(
  "appState/moveSceneTiles",
  async (
    { selectedArea, firstTileOriginInSprite, tiles, transparent, restoreArea },
    { getState, dispatch }
  ) => {
    const [originX, originY] = firstTileOriginInSprite;
    const state = getState();
    const scene = state.appState.scene;
    const layer = scene.layers[scene.selectedLayerIndex];

    if (
      CanvasUtil.hasExistedTile({
        selectedArea,
        firstTileOriginInSprite: [originX, originY],
        layer,
        transparent,
      })
    ) {
      dispatch(selectModeActions.selectArea(restoreArea));
      dispatch(
        addTilesToScene({
          selectedArea: restoreArea,
          firstTileOriginInSprite,
          tiles,
          transparent,
          disableCheckExistedTile: true,
        })
      );
    } else {
      dispatch(
        addTilesToScene({
          selectedArea,
          firstTileOriginInSprite,
          tiles,
          transparent,
        })
      );
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
    addTileToScene: (state, action) => {
      const layerIndex = state.scene.selectedLayerIndex;
      const [indexX, indexY] = action.payload.index;
      const tile = action.payload.tile;

      if (!state.scene.layers[layerIndex].tiles[indexX]) {
        state.scene.layers[layerIndex].tiles[indexX] = [];
      }
      state.scene.layers[layerIndex].tiles[indexX][indexY] = tile;
    },
    addTilesToScene: (state, action) => {
      const selectedArea = action.payload.selectedArea;
      const [originX, originY] = action.payload.firstTileOriginInSprite;
      const transparent = action.payload.transparent || [];

      const layerIndex = state.scene.selectedLayerIndex;

      const addTiles = (area) => {
        const [indexX, indexY, sizeIndexX, sizeIndexY] = area;

        MatrixUtil.traverse([sizeIndexX, sizeIndexY], (x, y) => {
          if (!transparent.includes(`${originX + x}.${originY + y}`)) {
            if (!state.scene.layers[layerIndex].tiles[indexX + x]) {
              state.scene.layers[layerIndex].tiles[indexX + x] = [];
            }

            const source = action.payload.source;
            const tiles = action.payload.tiles;
            const tile = tiles?.[x]?.[y] || {
              source: action.payload.source,
              index: [originX + x, originY + y],
            };

            state.scene.layers[layerIndex].tiles[indexX + x][indexY + y] = tile;
          }
        });
      };

      if (
        !action.payload.disableCheckExistedTile &&
        CanvasUtil.hasExistedTile({
          selectedArea,
          firstTileOriginInSprite: [originX, originY],
          layer: state.scene.layers[layerIndex],
          transparent,
        })
      ) {
        return;
      }

      const [indexX, indexY, sizeIndexX, sizeIndexY] = selectedArea;

      MatrixUtil.traverse([sizeIndexX, sizeIndexY], (x, y) => {
        if (!transparent.includes(`${originX + x}.${originY + y}`)) {
          if (!state.scene.layers[layerIndex].tiles[indexX + x]) {
            state.scene.layers[layerIndex].tiles[indexX + x] = [];
          }

          const source = action.payload.source;
          const tiles = action.payload.tiles;
          const tile = tiles?.[x]?.[y] || {
            source: action.payload.source,
            index: [originX + x, originY + y],
          };

          state.scene.layers[layerIndex].tiles[indexX + x][indexY + y] = tile;
        }
      });
    },
    deleteSceneTiles: (state, action) => {
      const selectedArea = CanvasUtil.normalizeRect(
        action.payload.selectedArea
      );
      const [indexX, indexY, sizeIndexX, sizeIndexY] = selectedArea;

      const layerIndex = state.scene.selectedLayerIndex;

      MatrixUtil.traverse([sizeIndexX, sizeIndexY], (x, y) => {
        if (!state.scene.layers[layerIndex].tiles[indexX + x]) {
          state.scene.layers[layerIndex].tiles[indexX + x] = [];
        }
        state.scene.layers[layerIndex].tiles[indexX + x][indexY + y] =
          undefined;
      });
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
  addTileToScene,
  addTilesToScene,
  deleteSceneTiles,
  addLayer,
  selectLayer,
} = appStateSlice.actions;

export const selectedLayerSelector = (state) =>
  state.appState.scene.layers[state.appState.scene.selectedLayerIndex];

export default appStateSlice.reducer;
