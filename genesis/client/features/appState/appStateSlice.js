import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as editMode from '@/features/editMode/editModeSlice';
import { CanvasUtil } from '@/utils/CanvasUtil';
import { MatrixUtil } from '@/utils/MatrixUtil';
import { MODE } from '@/constants';
import { Object2DUtil } from '@/utils/Object2DUtil';

export const setMode = createAsyncThunk(
  'appState/setMode',
  async ({ mode, payload }, { getState, dispatch }) => {
    const lifecycle = {
      [MODE.SELECT]: editMode,
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
        addLandTilesByRect({
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
          cmd.object2ds.add({
            rect: [...index, rect[2], rect[3]],
            object2d: T.object2d,
          }),
        );
      }
  
      if (T.rect && T.object2d) {
        dispatch(
          cmd.object2ds.add({
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
      addLandTilesByRect({
        selectedArea,
        localOriginIndex,
        tiles,
        transparent,
      }),
    );
  },
);

export const cmd = {
  redo: createAsyncThunk(
    'appState/redo',
    async (_, { extra: { commandManager } }) => {
      commandManager.redo();
     
    }
  ),
  undo: createAsyncThunk(
    'appState/undo',
    async (_, { extra: { commandManager } }) => {
      commandManager.undo();
     
    }
  ),
  tiles: {
    add: createAsyncThunk(
      'appState/addTiles',
      async (
        { selectedArea, localOriginIndex, tiles, transparent },
        { getState, dispatch, extra: { commandManager }
      }) => {
        const state = getState();
        const layerIndex = state.appState.land.selectedLayerIndex;
    
        commandManager.executeCmd({
          execute: () => {
            // dispatch(deleteLandTilesByRect({ layerIndex, rect: CanvasUtil.normalizeRect(rect) }));
          },
          undo: () => {
            // dispatch(addLandObject2DsByIndices({ layerIndex, object2DIndicesMap }));
          },
          redo: () => {
            // dispatch(deleteLandTilesByRect({ layerIndex, rect: CanvasUtil.normalizeRect(rect) }));
          },
        });
      },
    ),
    delete: createAsyncThunk(
      'appState/deleteTiles',
      async ({ rect }, { getState, dispatch, extra: { commandManager } }) => {
        const state = getState();
        const layerIndex = state.appState.land.selectedLayerIndex;
    
        commandManager.executeCmd({
          execute: () => {
            dispatch(deleteLandTilesByRect({ layerIndex, rect: CanvasUtil.normalizeRect(rect) }));
          },
          undo: () => {
            // dispatch(addLandObject2DsByIndices({ layerIndex, object2DIndicesMap }));
          },
          redo: () => {
            dispatch(deleteLandTilesByRect({ layerIndex, rect: CanvasUtil.normalizeRect(rect) }));
          },
        });
      },
    ),
    // flat
  },
  object2ds: {
    add: createAsyncThunk(
      'appState/addObject2Ds',
      async ({ object2d, rect }, { getState, dispatch, extra: { commandManager } }) => {
        
        const state = getState();
        const layerIndex = state.appState.land.selectedLayerIndex;

        const object2DIndicesMap = {
          [state.appState.land.layers[layerIndex].object2ds.length]: {
            id: object2d.id,
            rect,
          }
        };

        commandManager.executeCmd({
          execute: () => {
            dispatch(addLandObject2DsByIndices({ layerIndex, object2DIndicesMap }));
          },
          undo: () => {
            dispatch(deleteLandObject2DsByIndices({ layerIndex, object2DIndicesMap }));
          },
          redo: () => {
            dispatch(addLandObject2DsByIndices({ layerIndex, object2DIndicesMap }));
          },
        });
      },
    ),
    delete: createAsyncThunk(
      'appState/deleteObject2Ds',
      async ({ rects }, { getState, dispatch, extra: { commandManager } }) => {
        const state = getState();
        const layerIndex = state.appState.land.selectedLayerIndex;
        const object2DIndicesMap = CanvasUtil.getSelectedObject2DIndicesMap({ land: state.appState.land, rects });
    
        commandManager.executeCmd({
          execute: () => {
            dispatch(deleteLandObject2DsByIndices({ layerIndex, object2DIndicesMap }));
          },
          undo: () => {
            dispatch(addLandObject2DsByIndices({ layerIndex, object2DIndicesMap }));
          },
          redo: () => {
            dispatch(deleteLandObject2DsByIndices({ layerIndex, object2DIndicesMap }));
          },
        });
      },
    ),
    // depart
  }
};

export const deleteSelectedElements = createAsyncThunk(
  'appState/deleteSelectedElements',
  async (_, { getState, dispatch }) => {
    const state = getState();
    const selector = editMode.selectedEditModeSelector(state);

    if (selector.mode === editMode.SELECT_MODE.TILE) {
      dispatch(cmd.tiles.delete({ rect: selector.rect.default }));
    }

    if (selector.mode === editMode.SELECT_MODE.OBJECT_2D) {
      dispatch(cmd.object2ds.delete({ rects: selector.rect.follows }));
      dispatch(editMode.destroy());
    }
  },
);

const initialState = {
  mode: MODE.EDIT,
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
    addLandObject2DsByIndices(state, action) {
      const { layerIndex, object2DIndicesMap } = action.payload;

      for (const key in object2DIndicesMap) {
        if (Object.prototype.hasOwnProperty.call(object2DIndicesMap, key)) {
          const object2d = object2DIndicesMap[key];
          state.land.layers[layerIndex].object2ds.splice(Number(key), 0, object2d);
        }
      }
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
    addLandTilesByRect: (state, action) => {
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
    departObject2D: (state, action) => {
      const layerIndex = state.land.selectedLayerIndex;
      const { rect, object2d } = action.payload;
      const tiles = Object2DUtil.tiles(object2d);

      MatrixUtil.traverse(rect, (index, { x, y }) => {
        if (!state.land.layers[layerIndex].tiles[x]) {
          state.land.layers[layerIndex].tiles[x] = [];
        }

        state.land.layers[layerIndex].tiles[x][y] = tiles[index.x][index.y];
      });
    },
    flatSelectedTiles: (state, action) => {
      const layerIndex = state.land.selectedLayerIndex;
      const { rect } = action.payload;

      MatrixUtil.traverse(rect, (_, { x, y }) => {
        if (!state.land.layers[layerIndex].tiles[x]) {
          state.land.layers[layerIndex].tiles[x] = [];
        }

        const tile = state.land.layers[layerIndex].tiles[x][y];

        if (tile && tile.length > 0) {
          state.land.layers[layerIndex].tiles[x][y] = [tile[tile.length - 1]];
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
    deleteLandTilesByRect: (state, action) => {
      const { layerIndex, rect } = action.payload;

      MatrixUtil.traverse(rect, (_, { x, y }) => {
        if (!state.land.layers[layerIndex].tiles[x]) {
          state.land.layers[layerIndex].tiles[x] = [];
        }
        state.land.layers[layerIndex].tiles[x][y] = undefined;
      });
    },
    deleteLandObject2DsByIndices: (state, action) => {
      const { object2DIndicesMap, layerIndex } = action.payload;

      Object.keys(object2DIndicesMap).forEach((index) => {
        delete state.land.layers[layerIndex].object2ds[Number(index)];
      });

      state.land.layers[layerIndex].object2ds = state.land.layers[layerIndex].object2ds.filter(Boolean);
    },
    deleteLandObject2DsCompletely(state, action) {
      const layerIndex = state.land.selectedLayerIndex;
      const { rects } = action.payload;

      state.land.layers[layerIndex].object2ds = state.land.layers[layerIndex].object2ds.filter((object2d) => {
        return !rects.some(rect => CanvasUtil.same(rect, object2d.rect));
      });     
    },
    selectLandLayer: (state, action) => {
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
  selectLandLayer,
  // tiles
  addTileToLand,
  addLandTilesByRect,
  fillTile,
  deleteLandTilesByRect,
  flatSelectedTiles,
  // object2d
  departObject2D,
  addLandObject2DsByIndices,
  deleteLandObject2DsByIndices,
} = appStateSlice.actions;

export const selectedMode = (state) => state.appState.mode;
export const selectedLand = (state) => state.appState.land;
export const selectedCurrentLayerSelector = (state) =>
  state.appState.land.layers[state.appState.land.selectedLayerIndex];

export default appStateSlice.reducer;
