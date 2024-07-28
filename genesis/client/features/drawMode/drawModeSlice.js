import { createSlice } from "@reduxjs/toolkit";

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

export const {
  init,
  destroy,
} = drawModeSlice.actions;

export default drawModeSlice.reducer;
