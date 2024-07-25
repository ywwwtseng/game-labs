import { createSlice } from "@reduxjs/toolkit";
import { MODE } from "@/constants";

const initialState = {
  selected: {
    progress: false,
    index: null,
  },
};

export const sceneSelectAreaSlice = createSlice({
  name: "sceneSelectArea",
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
} = sceneSelectAreaSlice.actions;

export default sceneSelectAreaSlice.reducer;
