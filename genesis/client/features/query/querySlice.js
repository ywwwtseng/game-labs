import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const serialize = (T) => JSON.stringify(T);

export const query = createAsyncThunk(
  'query/query',
  async ({ queryKey, queryFn }, { dispatch }) => {
    const res = await queryFn();

    dispatch(setQuery({
      queryKey: serialize(queryKey),
      data: res?.data,
    }));

});

const initialState = {
  client: {},
};

export const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setQuery: (state, action) => {
      const { queryKey, data } = action.payload;
      state.client[queryKey] = {
        data,
      };
    },
  },
});

export const { setQuery } = querySlice.actions;

export default querySlice.reducer;
