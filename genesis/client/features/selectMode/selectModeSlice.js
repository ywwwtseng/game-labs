import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selected: {
    progress: false,
    index: null,
  },
};

export const selectModeSlice = createSlice({
  name: "selectMode",
  initialState,
  reducers: {
    selectAreaStart: (state, action) => {
      state.selected.progress = Boolean(action.payload);
      state.selected.index = action.payload;
    },
    selectArea: (state, action) => {
      state.selected.index = action.payload;
    },
    selectAreaStop: (state) => {
      state.selected.progress = false;
    },
  },
});

export const {
  selectAreaStart,
  selectArea,
  selectAreaStop,
} = selectModeSlice.actions;

export default selectModeSlice.reducer;
