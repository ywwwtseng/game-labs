import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filename: null,
  index: null,
};

export const drawModeSlice = createSlice({
  name: "drawMode",
  initialState,
  reducers: {
    init: (state, action) => {
      state.filename = action.payload.filename;
      state.index = action.payload.index;
    },
    destroy: (state) => {
      state.filename = null;
      state.index = null;
    },
  },
});

export const {
  init,
  destroy,
} = drawModeSlice.actions;

export default drawModeSlice.reducer;
