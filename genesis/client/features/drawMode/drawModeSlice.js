import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  source: null,
  index: null,
};

export const drawModeSlice = createSlice({
  name: "drawMode",
  initialState,
  reducers: {
    init: (state, action) => {
      state.source = action.payload.source;
      state.index = action.payload.index;
    },
    destroy: (state) => {
      state.source = null;
      state.index = null;
    },
  },
});

export const { init, destroy } = drawModeSlice.actions;

export default drawModeSlice.reducer;
