import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as editMode from '@/features/editMode/editModeSlice';
import { CanvasUtil } from '@/utils/CanvasUtil';
import { MatrixUtil } from '@/utils/MatrixUtil';
import { MODE } from '@/constants';
import { selectedCamera } from '@/features/camera/cameraSlice';
import { Vec2Util } from '@/utils/Vec2Util';

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

export const cmd = {
  redo: createAsyncThunk(
    'appState/redo',
    async (_, { dispatch, extra: { commandManager } }) => {
      dispatch(editMode.destroy());
      commandManager.redo();
     
    }
  ),
  undo: createAsyncThunk(
    'appState/undo',
    async (_, { dispatch, extra: { commandManager } }) => {
      dispatch(editMode.destroy());
      commandManager.undo();
     
    }
  ),
  tiles: {
    add: createAsyncThunk(
      'appState/addTiles',
      async (
        payload,
        { getState, dispatch, extra: { commandManager }
      }) => {
        const state = getState();
        const camera = selectedCamera(state);
        const layer = selectedCurrentLayerSelector(state);
        const layerIndex = state.appState.land.selectedLayerIndex;

        let rect;
        let tilesMatrix;

        if (payload.event && payload.tiles) {
          const { event, tiles, transparent = [] } = payload;
          const originX = tiles.rect[0];
          const originY = tiles.rect[1];
          
          rect = CanvasUtil.getDraggedIconRect(event, tiles.rect);
          tilesMatrix = MatrixUtil.create(rect, ({ x, y }) => {
            if (transparent.includes(`${originX + x}.${originY + y}`)) {
              return null;
            }
    
            return [{
              source: tiles.source,
              index: [originX + x, originY + y],
            }];
          });
        } else if (payload.rect && payload.tile) {
          rect = payload.rect;
          tilesMatrix = MatrixUtil.create(rect, () => [payload.tile]);
        } else if (payload.rect && payload.tilesMatrix) {
          rect = payload.rect;
          tilesMatrix = payload.tilesMatrix;
        }

        rect = CanvasUtil.toCameraSpace(rect, camera);

        if (payload.uniq) {
          tilesMatrix = MatrixUtil.create(rect, (index, coordinate) => {
            return tilesMatrix[index.x][index.y]?.filter((tile) => {
              const existedTiles = layer.tiles?.[coordinate.x]?.[coordinate.y];
              return existedTiles?.every((existedTile) => !CanvasUtil.sameTile(tile, existedTile));
            });
          });
        }
    
        

        commandManager.executeCmd({
          merge: payload.merge,
          execute: () => {
            dispatch(addLandTiles({ layerIndex, rect, tiles: tilesMatrix }));
          },
          undo: () => {
            dispatch(deleteLandTilesByTiles({ layerIndex, rect, tiles: tilesMatrix }));
          },
          redo: () => {
            dispatch(addLandTiles({ layerIndex, rect, tiles: tilesMatrix }));
          },
        });
      },
    ),
    delete: createAsyncThunk(
      'appState/deleteTiles',
      async ({ rect }, { getState, dispatch, extra: { commandManager } }) => {
        const state = getState();
        const camera = selectedCamera(state);
        rect = CanvasUtil.toCameraSpace(rect, camera);
        const layerIndex = state.appState.land.selectedLayerIndex;
        const tiles = CanvasUtil.copyLandTiles(rect, state.appState.land);
    
        commandManager.executeCmd({
          execute: () => {
            dispatch(deleteLandTilesByRect({ layerIndex, rect: CanvasUtil.normalizeRect(rect) }));
          },
          undo: () => {
            dispatch(addLandTiles({ layerIndex, rect, tiles }));
          },
          redo: () => {
            dispatch(deleteLandTilesByRect({ layerIndex, rect: CanvasUtil.normalizeRect(rect) }));
          },
        });
      },
    ),
    flat: createAsyncThunk(
      'appState/flatTiles',
      async ({ rect }, { getState, dispatch }) => {
        const state = getState();
        const land = selectedLand(state);
        const camera = selectedCamera(state);
        const flattenedTiles = CanvasUtil.copyLandTiles(
          CanvasUtil.toCameraSpace(rect, camera),
          land,
          (tileItems) => [tileItems?.[tileItems.length - 1]]?.filter(Boolean)
        );

        dispatch(cmd.tiles.delete({ rect }));
        dispatch(cmd.tiles.add({ merge: true, rect, tilesMatrix: flattenedTiles }));
      },
    )
  },
  object2ds: {
    add: createAsyncThunk(
      'appState/addObject2Ds',
      async (payload, { getState, dispatch, extra: { commandManager } }) => {
        const object2d = payload.object2d;
  
        const state = getState();
        const camera = selectedCamera(state);
        const layerIndex = state.appState.land.selectedLayerIndex;

        const object2DIndicesMap = {
          [state.appState.land.layers[layerIndex].object2ds.length]: {
            id: object2d.id,
            rect: CanvasUtil.toCameraSpace(payload.rect || CanvasUtil.getDraggedIconRect(payload.event, object2d), camera),
          }
        };

        commandManager.executeCmd({
          merge: payload.merge,
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
        const camera = selectedCamera(state);
        const object2DIndicesMap = CanvasUtil.getSelectedObject2DIndicesMap({
          land: state.appState.land,
          rects: rects.map((rect) => CanvasUtil.toCameraSpace(rect, camera)),
        });
    
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
    depart: createAsyncThunk(
      'appState/departObject2D',
      async ({ rect, object2d }, { getState, dispatch }) => {
        dispatch(editMode.destroy());
        dispatch(cmd.object2ds.delete({ rects: [rect] }));
        dispatch(cmd.tiles.add({ merge: true, rect, tilesMatrix: object2d.tiles }));
      },
    ),
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
  selectedLandId: localStorage.getItem('game-labs:selected-land-id'),
  land: undefined
};

export const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    selectLandId: (state, action) => {
      if (!action.payload) {
        state.land = undefined;
      }

      localStorage.setItem('game-labs:selected-land-id', action.payload || '');
      state.selectedLandId = action.payload;
    },
    setLand: (state, action) => {
      if (action.payload) {
        state.land = {
          ...action.payload,
          selectedLayerIndex: state.land?.selectedLayerIndex === 'undefined' ? state.land.selectedLayerIndex : 0
        };
      }
      
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
    addLandTiles: (state, action) => {
      const { rect, layerIndex, tiles } = action.payload;

      MatrixUtil.traverse(rect, ({ x, y }, index) => {
        const tileItems = tiles[x][y];

        if (tileItems) {
          if (!state.land.layers[layerIndex].tiles[index.x]) {
            state.land.layers[layerIndex].tiles[index.x] = [];
          }

          if (!state.land.layers[layerIndex].tiles[index.x][index.y]) {
            state.land.layers[layerIndex].tiles[index.x][index.y] = [];
          }

          const existedTiles = state.land.layers[layerIndex].tiles[index.x][index.y];
          // state.land.layers[layerIndex].tiles[index.x][index.y].push(
          //   ...tileItems.filter((tile) => !existedTiles.find((existedTile) => CanvasUtil.sameTile(existedTile, tile)))
          // );

          state.land.layers[layerIndex].tiles[index.x][index.y].push(...tileItems);
        }
      });
    },
    deleteLandTilesByTiles: (state, action) => {
      const { rect, layerIndex, tiles } = action.payload;

      MatrixUtil.traverse(rect, ({ x, y }, index) => {
        const tileItems = tiles[x][y];

        if (tileItems) {
          if (!state.land.layers[layerIndex].tiles[index.x]) {
            return;
          }

          if (!state.land.layers[layerIndex].tiles[index.x][index.y]) {
            return;
          }

          state.land.layers[layerIndex].tiles[index.x][index.y].splice(-tileItems.length, tileItems.length);
        }
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
  selectLandId,
  setLand,
  selectLandLayer,
  // tiles
  addLandTiles,
  deleteLandTilesByRect,
  deleteLandTilesByTiles,
  // object2d
  addLandObject2DsByIndices,
  deleteLandObject2DsByIndices,
} = appStateSlice.actions;

export const selectedMode = (state) => state.appState.mode;
export const selectedLand = (state) => state.appState.land;
export const selectedLandId = (state) => state.appState.selectedLandId;
export const selectedCurrentLayerSelector = (state) =>
  state.appState.land.layers[state.appState.land.selectedLayerIndex];

export const { reducer } = appStateSlice;
