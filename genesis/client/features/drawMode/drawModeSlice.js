import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  source: null,
  rect: null,
};

export const drawModeSlice = createSlice({
  name: 'drawMode',
  initialState,
  reducers: {
    init: (state, action) => {
      state.source = action.payload.source;
      state.rect = action.payload.rect;
    },
    destroy: (state) => {
      state.source = null;
      state.rect = null;
    },
  },
});

export const { init, destroy } = drawModeSlice.actions;

export default drawModeSlice.reducer;
