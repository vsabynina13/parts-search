import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchGoods } from '../api/partsApi';
import { toBrands, toOffers } from '../api/normalize';

export const searchBrands = createAsyncThunk('search/brands', async (number, { signal }) =>
  toBrands(await fetchGoods({ number }, signal))
);

export const searchOffers = createAsyncThunk('search/offers', async (part, { signal }) =>
  toOffers(await fetchGoods({ number: part.number, brand: part.brand }, signal))
);

const idle = { items: [], status: 'idle', error: null, requestId: null };

const initialState = {
  query: '',
  brands: idle,
  selected: null,
  offers: idle,
};

// Общая обработка pending/fulfilled/rejected; ответы устаревших запросов игнорируем
function addRequestCases(builder, thunk, key, onPending) {
  builder
    .addCase(thunk.pending, (state, action) => {
      onPending?.(state, action);
      state[key] = { ...state[key], status: 'loading', error: null, requestId: action.meta.requestId };
    })
    .addCase(thunk.fulfilled, (state, action) => {
      if (state[key].requestId !== action.meta.requestId) return;
      state[key] = { items: action.payload, status: 'succeeded', error: null, requestId: null };
    })
    .addCase(thunk.rejected, (state, action) => {
      if (state[key].requestId !== action.meta.requestId || action.meta.aborted) return;
      state[key] = { items: [], status: 'failed', error: action.error.message, requestId: null };
    });
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
    },
    reset() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    addRequestCases(builder, searchBrands, 'brands', (state) => {
      state.selected = null;
      state.offers = idle;
    });
    addRequestCases(builder, searchOffers, 'offers', (state, action) => {
      state.selected = action.meta.arg;
    });
  },
});

export const { setQuery, reset } = searchSlice.actions;
export default searchSlice.reducer;
