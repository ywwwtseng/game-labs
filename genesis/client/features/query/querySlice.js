import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const serialize = (T) => JSON.stringify(T);

export const  executeQuery = createAsyncThunk(
  'query/executeQuery',
  async ({ queryKey, queryFn }, { dispatch }) => {
    const res = await queryFn();

    dispatch(setQuery({
      queryKey: serialize(queryKey),
      data: res?.data,
    }));

});

const initialState = {};

export const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setQuery: (state, action) => {
      const { queryKey, data } = action.payload;
      state[queryKey] = {
        data,
      };
    },
    setQueryData(state, action) {
      const { relateQueryKey, data } = action.payload;

      for (let index = 0; index < Object.keys(state).length; index++) {
        const queryKey = Object.keys(state)[index];

        if (queryKey.includes(relateQueryKey)) {
          if (Array.isArray(state[queryKey].data)) {
            const index = state[queryKey].data.findIndex(({ id }) => id === data.id);
            state[queryKey].data[index] = data;
          }
        }
        
      }
    }
  },
});

export const { setQuery, setQueryData } = querySlice.actions;

export default querySlice.reducer;
