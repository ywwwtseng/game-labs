import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as selectMode from '@/features/selectMode/selectModeSlice';
import * as drawMode from '@/features/drawMode/drawModeSlice';
import { CanvasUtil } from '@/utils/CanvasUtil';
import { MatrixUtil } from '@/utils/MatrixUtil';
import { MODE } from '@/constants';
import { Object2D } from '@/utils/Object2D';

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
        const rect = Object2D.getRect(T.pattern);
        const pos = CanvasUtil.getDraggedIconPosition(T.event, rect, { x: 8, y: 8 });
        const index = CanvasUtil.positionToIndex(pos);
  
        dispatch(
          addPatternToScene({
            rect: [...index, rect[2], rect[3]],
            pattern: T.pattern,
          }),
        );
      }
  
      if (T.rect && T.pattern) {
        dispatch(
          addPatternToScene({
            rect: T.rect,
            pattern: T.pattern,
          }),
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
      }),
    );
  },
);

export const deleteSelectedElements = createAsyncThunk(
  'appState/deleteSelectedElements',
  async (_, { getState, dispatch }) => {
    try {
      const state = getState();
      const selector = selectMode.selectedSelectModeSelector(state);

      if (selector.mode === selectMode.SELECT_MODE.TILE) {
        dispatch(deleteSceneTiles(selector.rect.default));
      }

      if (selector.mode === selectMode.SELECT_MODE.PATTERN) {
        dispatch(
          selectMode.forceSelectArea({ default: selector.rect.default }),
        );
        dispatch(deleteScenePatterns({ rects: selector.rect.follows, completely: true }));
        dispatch(selectMode.destroy());
      }

    } catch (error) {
      console.log(error)
    }

   
  },
);

const initialState = {
  mode: MODE.SELECT,
  // scene: undefined
  scene: {
    name: 'Land #1',
    width: 512,
    height: 512,
    selectedLayerIndex: 0,
    layers: [
      {
        name: 'Background Layer',
        tiles: [],
        patterns: [],
      },
      {
        name: 'Entity Layer',
        tiles: [],
        patterns: [],
      },
      {
        name: 'Foreground Layer',
        tiles: [],
        patterns: [],
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
      const pattern_id = action.payload.pattern.id;

      state.scene.layers[layerIndex].patterns.push({
        id: pattern_id,
        rect: action.payload.rect,
      });
    },
    addTileToScene: (state, action) => {
      const layerIndex = state.scene.selectedLayerIndex;
      const [indexX, indexY] = action.payload.index;
      const tile = action.payload.tile;

      if (!state.scene.layers[layerIndex].tiles[indexX]) {
        state.scene.layers[layerIndex].tiles[indexX] = [];
      }

      if (!state.scene.layers[layerIndex].tiles[indexX][indexY]) {
        state.scene.layers[layerIndex].tiles[indexX][indexY] = [];
      }

      if (tile) {
        state.scene.layers[layerIndex].tiles[indexX][indexY].push(tile);
      } else {
        state.scene.layers[layerIndex].tiles[indexX][indexY] = [];
      }
    },
    addTilesToScene: (state, action) => {
      const selectedArea = action.payload.selectedArea;
      const [originX, originY] = action.payload.localOriginIndex;
      const transparent = action.payload.transparent || [];
      const layerIndex = state.scene.selectedLayerIndex;

      MatrixUtil.traverse(selectedArea, ({ x, y }, index) => {
        if (!transparent.includes(`${originX + x}.${originY + y}`)) {
          if (!state.scene.layers[layerIndex].tiles[index.x]) {
            state.scene.layers[layerIndex].tiles[index.x] = [];
          }
          const tileItems = action.payload.tiles?.[x]?.[y];

          if (!state.scene.layers[layerIndex].tiles[index.x][index.y]) {
            state.scene.layers[layerIndex].tiles[index.x][index.y] = [];
          }

          if (tileItems) {
            state.scene.layers[layerIndex].tiles[index.x][index.y].push(...tileItems);
          } else {
            state.scene.layers[layerIndex].tiles[index.x][index.y].push({
              source: action.payload.source,
              index: [originX + x, originY + y],
            });
          }
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

        state.scene.layers[layerIndex].tiles[x][y] = [tile];
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
      const { rects, completely } = action.payload;
      const patterns = state.scene.layers[layerIndex].patterns;

      if (completely) {
        state.scene.layers[layerIndex].patterns = state.scene.layers[layerIndex].patterns.filter((pattern) => {
          return !rects.some(rect => CanvasUtil.same(rect, pattern.rect));
        });

      } else {
        for (let i = 0; i < rects.length; i++) {
          const rect = rects[i];
  
          for (let j = patterns.length - 1; j >= 0; j--) {
            const pattern = state.scene.layers[layerIndex].patterns[j];
  
            if (pattern && CanvasUtil.same(rect, pattern.rect)) {
              delete state.scene.layers[layerIndex].patterns[j];
              break;
            }
          }
        }
  
        state.scene.layers[layerIndex].patterns = state.scene.layers[layerIndex].patterns.filter(Boolean);
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
