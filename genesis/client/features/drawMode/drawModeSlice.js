import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addSceneTile } from "@/features/appState/appStateSlice";
import { CanvasUtil } from "@/utils/CanvasUtil";
import { MatrixUtil } from "@/utils/MatrixUtil";

export const draw = createAsyncThunk(
  "drawMode/draw",
  async ({ event, selected, transparent = [] }, { getState, dispatch }) => {
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
      return;
    }

    for (let x = 0; x < sizeIndexX; x++) {
      for (let y = 0; y < sizeIndexY; y++) {
        if (
          layer.tiles?.[index[0] + x]?.[index[1] + y] &&
          !transparent.includes(`${originX + x}.${originY + y}`)
        ) {
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
  }
);

const initialState = {
  path: null,
  index: null,
};

export const drawModeSlice = createSlice({
  name: "drawMode",
  initialState,
  reducers: {
    init: (state, action) => {
      state.path = action.payload.path;
      state.index = action.payload.index;
    },
    destroy: (state) => {
      state.path = null;
      state.index = null;
    },
  },
});

export const { init, destroy } = drawModeSlice.actions;

export default drawModeSlice.reducer;
