

import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const viewModeSlice = createSlice({
  name: 'viewMode',
  initialState,
  reducers: {
    init(state, action) {},
    distroy(state, action) {},
  }
});

export const {} = viewModeSlice.actions;

export const { reducer } = viewModeSlice;

