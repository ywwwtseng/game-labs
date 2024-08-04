import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as selectMode from '@/features/selectMode/selectModeSlice';
import * as drawMode from '@/features/drawMode/drawModeSlice';
import { CanvasUtil } from '@/utils/CanvasUtil';
import { MatrixUtil } from '@/utils/MatrixUtil';
import { MODE } from '@/constants';

export const setMode = createAsyncThunk(
  'appState/setMode',
  async ({ mode, payload }, { getState, dispatch }) => {
    const lifecycle = {
      [MODE.SELECT]: selectMode,
      [MODE.DRAW]: drawMode,
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
  },
);

export const drawTiles = createAsyncThunk(
  'appState/drawTiles',
  async ({ event, selectedTiles, transparent = [] }, { dispatch }) => {
    try {
      const [originX, originY, sizeIndexX, sizeIndexY] = selectedTiles.rect;

      const pos = CanvasUtil.getDraggedIconPosition(event, selectedTiles.rect, {
        x: 8,
        y: 8,
      });
      const index = CanvasUtil.positionToIndex(pos);

      dispatch(
        addTilesToScene({
          selectedArea: [index[0], index[1], sizeIndexX, sizeIndexY],
          localOriginIndex: [originX, originY],
          transparent,
          source: selectedTiles.source,
        }),
      );
    } catch (error) {
      console.log(error);
    }
  },
);

export const drawPattern = createAsyncThunk(
  'appState/drawPattern',
  async (T, { dispatch }) => {
    try {
      if (T.event && T.pattern) {
        const rect = CanvasUtil.getPatternRect(T.pattern);
        const pos = CanvasUtil.getDraggedIconPosition(T.event, rect, { x: 8, y: 8 });
        const index = CanvasUtil.positionToIndex(pos);
  
        dispatch(
          addPatternToScene({
            index,
            pattern: T.pattern,
          }),
        );
      }
  
      if (T.index && T.pattern) {
        dispatch(
          addPatternToScene(T),
        );
      }
    } catch (error) {
      console.log(error);
    }

    
  },
);

export const moveSceneTiles = createAsyncThunk(
  'appState/moveSceneTiles',
  async (
    { selectedArea, localOriginIndex, tiles, transparent },
    { dispatch },
  ) => {
    dispatch(
      addTilesToScene({
        selectedArea,
        localOriginIndex,
        tiles,
        transparent,
        disableCheckExistedTile: true,
      }),
    );
  },
);

export const deleteSelectedElements = createAsyncThunk(
  'appState/deleteSelectedElements',
  async (_, { getState, dispatch }) => {
    const state = getState();
    const selector = selectMode.selectedSelectModeSeletor(state);

    if (selector.mode === selectMode.SELECT_MODE.TILE) {
      dispatch(deleteSceneTiles(selector.rect.default));
    }

    if (selector.mode === selectMode.SELECT_MODE.PATTERN) {
      dispatch(
        selectMode.forceSelectArea({ default: selector.rect.default }),
      );
      dispatch(deleteScenePatterns({ rects: selector.rect.follows, fully: true }));
      dispatch(selectMode.destroy());
    }

   
  },
);

const initialState = {
  mode: MODE.SELECT,
  // scene: undefined
  scene: {
    name: 'default',
    width: 512,
    height: 512,
    selectedLayerIndex: 0,
    layers: [
      {
        tiles: [],
        patterns: {},
      },
    ],
  },
};

export const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    addScene: (state, action) => {
      state.scene = { ...state.scene, ...action.payload };
    },
    addPatternToScene(state, action) {
      const layerIndex = state.scene.selectedLayerIndex;
      const [indexX, indexY] = action.payload.index;
      const pattern_id = action.payload.pattern.id;

      if (!state.scene.layers[layerIndex].tiles[indexX]) {
        state.scene.layers[layerIndex].tiles[indexX] = [];
      }

      const pattern = state.scene.layers[layerIndex].patterns[pattern_id];



      if (!pattern) {
        state.scene.layers[layerIndex].patterns[pattern_id] = {
          ...action.payload.pattern,
          index: [[indexX, indexY]],
        };
      } else {
        state.scene.layers[layerIndex].patterns[pattern_id].index.push([
          indexX,
          indexY,
        ]);
      }
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
      const [originX, originY] = action.payload.localOriginIndex;
      const transparent = action.payload.transparent || [];

      const layerIndex = state.scene.selectedLayerIndex;

      if (
        !action.payload.disableCheckExistedTile &&
        CanvasUtil.hasExistedTile({
          selectedArea,
          localOriginIndex: [originX, originY],
          layer: state.scene.layers[layerIndex],
          transparent,
        })
      ) {
        return;
      }

      MatrixUtil.traverse(selectedArea, ({ x, y }, index) => {
        if (!transparent.includes(`${originX + x}.${originY + y}`)) {
          if (!state.scene.layers[layerIndex].tiles[index.x]) {
            state.scene.layers[layerIndex].tiles[index.x] = [];
          }
          const tiles = action.payload.tiles;
          const tile = tiles?.[x]?.[y] || {
            source: action.payload.source,
            index: [originX + x, originY + y],
          };

          state.scene.layers[layerIndex].tiles[index.x][index.y] = tile;
        }
      });
    },
    fillTile: (state, action) => {
      const layerIndex = state.scene.selectedLayerIndex;
      const selectedRect = action.payload.selectedRect;
      const tile = action.payload.tile;

      MatrixUtil.traverse(selectedRect, (_, { x, y }) => {
        if (!state.scene.layers[layerIndex].tiles[x]) {
          state.scene.layers[layerIndex].tiles[x] = [];
        }

        state.scene.layers[layerIndex].tiles[x][y] = tile;
      });
    },
    deleteSceneTiles: (state, action) => {
      const selectedArea = CanvasUtil.normalizeRect(action.payload);
      const layerIndex = state.scene.selectedLayerIndex;

      MatrixUtil.traverse(selectedArea, (_, { x, y }) => {
        if (!state.scene.layers[layerIndex].tiles[x]) {
          state.scene.layers[layerIndex].tiles[x] = [];
        }
        state.scene.layers[layerIndex].tiles[x][y] = undefined;
      });
    },
    deleteScenePatterns: (state, action) => {
      const layerIndex = state.scene.selectedLayerIndex;
      const { rects, fully } = action.payload;
      const patterns = state.scene.layers[layerIndex].patterns;
      const patternKeys = Object.keys(patterns);

      for (let i = 0; i < rects.length; i++) {
        let deleted = false;

        const rect = rects[i];

        for (let j = patternKeys.length - 1; j >= 0; j--) {
          const pattern = state.scene.layers[layerIndex].patterns[patternKeys[j]];
          const sizeIndex = MatrixUtil.sizeIndex(pattern.tiles);
          const index = state.scene.layers[layerIndex].patterns[patternKeys[j]].index;

          for (let k = 0; k < index.length; k++) {
            if (CanvasUtil.same(rect, [...index[k], ...sizeIndex])) {
              delete state.scene.layers[layerIndex].patterns[patternKeys[j]].index[k];

              state.scene.layers[layerIndex].patterns[patternKeys[j]].index = 
                state.scene.layers[layerIndex].patterns[patternKeys[j]].index.filter(Boolean);

              deleted = true;

              if (!fully) {
                break;
              }
            }
          }

          if (deleted) {
            if (!fully) {
              break;
            }
          }
        }

        if (deleted) {
          if (!fully) {
            break;
          }
        }
      }
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
  addScene,
  addTileToScene,
  addTilesToScene,
  fillTile,
  deleteSceneTiles,
  deleteScenePatterns,
  addPatternToScene,
  addLayer,
  selectLayer,
} = appStateSlice.actions;

export const selectedIsDrawMode = (state) => state.appState.mode === MODE.DRAW;
export const selectedScene = (state) => state.appState.scene;
export const selectedCurrentLayerSelector = (state) =>
  state.appState.scene.layers[state.appState.scene.selectedLayerIndex];

export default appStateSlice.reducer;
