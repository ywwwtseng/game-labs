import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const serialize = (T) => JSON.stringify(T);

export const getQueryFn = createAsyncThunk(
  'query/getQueryFn',
  async ({ queryKey }, { dispatch, extra: { queryFns } }) => {
    return queryFns.get(serialize(queryKey))
});

export const executeQuery = createAsyncThunk(
  'query/executeQuery',
  async ({ queryKey, queryFn, force = false }, { getState, dispatch, extra: { queryFns }, requestId }) => {
    if (force || !queryFns.get(serialize(queryKey))) {
      queryFns.set(serialize(queryKey), queryFn);
      const res = await queryFn();
      return res;
    }
});

export const invalidateQueries = createAsyncThunk(
  'query/invalidateQueries',
  async ({ queryKeys }) => {
    queryKeys.map((queryKey) => [queryKey, queryFns.get(serialize(queryKey))]).forEach(([queryKey, queryFn]) => {
      dispatch(executeQuery({ queryKey, queryFn, force: true }));
    });
  }
)

const initialState = {};

export const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setQueryData: (state, action) => {
      const { queryKey, data } = action.payload;
      state[queryKey] = {
        data,
      };
    },
    setRelateQueryData(state, action) {
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
  extraReducers: (builder) => {
    builder
      .addCase(executeQuery.pending, (state, action) => {
        const { queryKey } = action.meta.arg;

        if (!state[serialize(queryKey)]) {

          state[serialize(queryKey)] = {
            requestId: action.meta.requestId,
            loading: 'pending',
          };
        }
        
      })
      .addCase(executeQuery.fulfilled, (state, action) => {
        if (action.payload) {
          const { queryKey } = action.meta.arg;

          state[serialize(queryKey)] = {
            ...state[serialize(queryKey)],
            loading: 'idle',
            data: action.payload.data,
          };
        }
        
      })
      .addCase(executeQuery.rejected, (state, action) => {
        const { queryKey } = action.meta.arg;
        state[serialize(queryKey)] = {
          ...state[serialize(queryKey)],
          loading: 'idle',
        };
      });
  }
});

export const { setQueryData, setRelateQueryData } = querySlice.actions;

export default querySlice.reducer;
