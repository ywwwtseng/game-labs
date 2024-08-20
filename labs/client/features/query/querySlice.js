import { ObjectUtil } from '@/utils/ObjectUtil';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const serialize = (T) => JSON.stringify(T);

export const executeQuery = createAsyncThunk(
  'query/executeQuery',
  async ({ queryKey, params, queryFn, force = false }, { getState, dispatch, extra: { queryFns }, requestId }) => {
    if (force || !queryFns.get(serialize({ queryKey, params }))) {
      queryFns.set(serialize({ queryKey, params }), queryFn);
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
      const { relateQueryKey, params, data } = action.payload;

      for (let index = 0; index < Object.keys(state).length; index++) {
        const queryKey = Object.keys(state)[index];

        if (queryKey.includes(relateQueryKey)) {
          if (params) {
            {let queryParams; if (queryParams = JSON.parse(queryKey).params) {
              if (ObjectUtil.equals(queryParams, params)) {
                state[queryKey].data = data;
                break;
              }
            }}
          }
          
          if (state[queryKey].data?.push) {
            const index = state[queryKey].data.findIndex(({ id }) => id === data.id);
            if (index !== -1) {
              state[queryKey].data[index] = data;
            } else {
              state[queryKey].data.push(data);
            }
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
          const { queryKey, params } = action.meta.arg;

          state[serialize({ queryKey, params })] = {
            ...state[serialize({ queryKey, params })],
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
export const selectedQuery = (sql) => (state) => state.query[serialize(sql)]

export const { reducer } = querySlice;
