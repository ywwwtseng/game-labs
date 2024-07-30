import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selected: {
    progress: false,
    rect: null,
  },
};

export const selectModeSlice = createSlice({
  name: "selectMode",
  initialState,
  reducers: {
    selectAreaStart: (state, action) => {
      state.selected.progress = Boolean(action.payload);
      state.selected.rect = action.payload;
    },
    selectArea: (state, action) => {
      state.selected.rect = action.payload;
    },
    selectAreaStop: (state) => {
      state.selected.progress = false;
    },
    destroy: (state) => {
      state.selected.rect = null;
    },
  },
});

export const {
  selectAreaStart,
  selectArea,
  selectAreaStop,
  destroy,
} = selectModeSlice.actions;

export default selectModeSlice.reducer;
