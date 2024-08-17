

import { createSlice } from '@reduxjs/toolkit';

const calcCameraPos = (pos, size) => {
  //   - pos.x + s <= 1024 - ize.x
  return {
    x: Math.max(0, Math.min(1024 - size.x, pos.x)),
    y: Math.max(0, Math.min(1024 - size.y, pos.y)),
  }

};

const calcCameraSize = () => {
  const x = y = Math.floor((Math.min(window.innerWidth - 220, window.innerHeight - 52) - 50) / 16) * 16;
  return {
    x,
    y
  };
};

const initialState = {
  pos: {
    x: 0,
    y: 0,
  },
  size: calcCameraSize(),
};

const cameraSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    updateCameraPos(state, action) {
      const { delta } = action.payload;
      state.pos = calcCameraPos(
        {
          x: state.pos.x + delta.x,
          y: state.pos.y + delta.y
        },
        state.size
      );
    },
    normalizeCameraPos(state, action) {
      state.pos.x = Math.round(state.pos.x / 16) * 16;
      state.pos.y = Math.round(state.pos.y / 16) * 16;
    },
    updateCameraSize(state, action) {
      state.pos = {
        x: 0,
        y: 0,
      };
      state.size = calcCameraSize();
    },
  }
});

export const {
  updateCameraPos,
  normalizeCameraPos,
  updateCameraSize
} = cameraSlice.actions;

export const selectedCamera = (state) => state.camera;

export const { reducer } = cameraSlice;

