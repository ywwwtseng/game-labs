import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as selectMode from '@/features/selectMode/selectModeSlice';
import * as drawMode from '@/features/drawMode/drawModeSlice';
import { CanvasUtil } from '@/utils/CanvasUtil';
import { MatrixUtil } from '@/utils/MatrixUtil';
import { MODE } from '@/constants';
import { Object2DUtil } from '@/utils/Object2DUtil';

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
        addTilesToLand({
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

export const drawObject2D = createAsyncThunk(
  'appState/drawObject2D',
  async (T, { dispatch }) => {
    try {
      if (T.event && T.object2d) {
        const rect = Object2DUtil.getRect(T.object2d);
        const pos = CanvasUtil.getDraggedIconPosition(T.event, rect, { x: 8, y: 8 });
        const index = CanvasUtil.positionToIndex(pos);
  
        dispatch(
          addObject2DToLand({
            rect: [...index, rect[2], rect[3]],
            object2d: T.object2d,
          }),
        );
      }
  
      if (T.rect && T.object2d) {
        dispatch(
          addObject2DToLand({
            rect: T.rect,
            object2d: T.object2d,
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }

    
  },
);

export const moveLandTiles = createAsyncThunk(
  'appState/moveLandTiles',
  async (
    { selectedArea, localOriginIndex, tiles, transparent },
    { dispatch },
  ) => {
    dispatch(
      addTilesToLand({
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
        dispatch(deleteLandTiles(selector.rect.default));
      }

      if (selector.mode === selectMode.SELECT_MODE.OBJECT_2D) {
        dispatch(
          selectMode.forceSelectArea({ default: selector.rect.default }),
        );
        dispatch(deleteLandObject2Ds({ rects: selector.rect.follows, completely: true }));
        dispatch(selectMode.destroy());
      }

    } catch (error) {
      console.log(error)
    }

   
  },
);

const initialState = {
  mode: MODE.SELECT,
  // land: undefined
  land: {
    name: 'Land #1',
    width: 512,
    height: 512,
    selectedLayerIndex: 0,
    layers: [
      {
        name: 'Background Layer',
        tiles: [],
        object2ds: [],
      },
      {
        name: 'Entity Layer',
        tiles: [],
        object2ds: [],
      },
      {
        name: 'Foreground Layer',
        tiles: [],
        object2ds: [],
      },
    ],
  },
};

export const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    addLand: (state, action) => {
      state.land = { ...state.land, ...action.payload };
    },
    addObject2DToLand(state, action) {
      const layerIndex = state.land.selectedLayerIndex;
      const object2d_id = action.payload.object2d.id;

      state.land.layers[layerIndex].object2ds.push({
        id: object2d_id,
        rect: action.payload.rect,
      });
    },
    addTileToLand: (state, action) => {
      const layerIndex = state.land.selectedLayerIndex;
      const [indexX, indexY] = action.payload.index;
      const tile = action.payload.tile;

      if (!state.land.layers[layerIndex].tiles[indexX]) {
        state.land.layers[layerIndex].tiles[indexX] = [];
      }

      if (!state.land.layers[layerIndex].tiles[indexX][indexY]) {
        state.land.layers[layerIndex].tiles[indexX][indexY] = [];
      }

      if (tile) {
        state.land.layers[layerIndex].tiles[indexX][indexY].push(tile);
      } else {
        state.land.layers[layerIndex].tiles[indexX][indexY] = [];
      }
    },
    addTilesToLand: (state, action) => {
      const selectedArea = action.payload.selectedArea;
      const [originX, originY] = action.payload.localOriginIndex;
      const transparent = action.payload.transparent || [];
      const layerIndex = state.land.selectedLayerIndex;

      MatrixUtil.traverse(selectedArea, ({ x, y }, index) => {
        if (!transparent.includes(`${originX + x}.${originY + y}`)) {
          if (!state.land.layers[layerIndex].tiles[index.x]) {
            state.land.layers[layerIndex].tiles[index.x] = [];
          }
          const tileItems = action.payload.tiles?.[x]?.[y];

          if (!state.land.layers[layerIndex].tiles[index.x][index.y]) {
            state.land.layers[layerIndex].tiles[index.x][index.y] = [];
          }

          if (tileItems) {
            state.land.layers[layerIndex].tiles[index.x][index.y].push(...tileItems);
          } else {
            state.land.layers[layerIndex].tiles[index.x][index.y].push({
              source: action.payload.source,
              index: [originX + x, originY + y],
            });
          }
        }
      });
    },
    fillTile: (state, action) => {
      const layerIndex = state.land.selectedLayerIndex;
      const selectedRect = action.payload.selectedRect;
      const tile = action.payload.tile;

      MatrixUtil.traverse(selectedRect, (_, { x, y }) => {
        if (!state.land.layers[layerIndex].tiles[x]) {
          state.land.layers[layerIndex].tiles[x] = [];
        }

        state.land.layers[layerIndex].tiles[x][y] = [tile];
      });
    },
    deleteLandTiles: (state, action) => {
      const selectedArea = CanvasUtil.normalizeRect(action.payload);
      const layerIndex = state.land.selectedLayerIndex;

      MatrixUtil.traverse(selectedArea, (_, { x, y }) => {
        if (!state.land.layers[layerIndex].tiles[x]) {
          state.land.layers[layerIndex].tiles[x] = [];
        }
        state.land.layers[layerIndex].tiles[x][y] = undefined;
      });
    },
    deleteLandObject2Ds: (state, action) => {
      const layerIndex = state.land.selectedLayerIndex;
      const { rects, completely } = action.payload;
      const object2ds = state.land.layers[layerIndex].object2ds;

      if (completely) {
        state.land.layers[layerIndex].object2ds = state.land.layers[layerIndex].object2ds.filter((object2d) => {
          return !rects.some(rect => CanvasUtil.same(rect, object2d.rect));
        });

      } else {
        for (let i = 0; i < rects.length; i++) {
          const rect = rects[i];
  
          for (let j = object2ds.length - 1; j >= 0; j--) {
            const object2d = state.land.layers[layerIndex].object2ds[j];
  
            if (object2d && CanvasUtil.same(rect, object2d.rect)) {
              delete state.land.layers[layerIndex].object2ds[j];
              break;
            }
          }
        }
  
        state.land.layers[layerIndex].object2ds = state.land.layers[layerIndex].object2ds.filter(Boolean);
      }

      
    },
    addLayer: (state) => {
      state.land.layers.push({ tiles: [] });
    },
    selectLayer: (state, action) => {
      state.land.selectedLayerIndex = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setMode.fulfilled, (state, action) => {
      state.mode = action.payload;
    });
  },
});

export const {
  addLand,
  addTileToLand,
  addTilesToLand,
  fillTile,
  deleteLandTiles,
  deleteLandObject2Ds,
  addObject2DToLand,
  addLayer,
  selectLayer,
} = appStateSlice.actions;

export const selectedIsDrawMode = (state) => state.appState.mode === MODE.DRAW;
export const selectedLand = (state) => state.appState.land;
export const selectedCurrentLayerSelector = (state) =>
  state.appState.land.layers[state.appState.land.selectedLayerIndex];

export default appStateSlice.reducer;
