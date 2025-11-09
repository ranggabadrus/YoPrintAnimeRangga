import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Anime, AnimeSearchResponse } from '../types/anime';

export type SearchParams = {
  q: string;
  page: number;
  limit?: number;
  type?: string | null;
  year?: number | null;
  score?: number | null;
  status?: string | null;
  rating?: string | null;
  orderBy?: string | null;
  sort?: 'asc' | 'desc' | null;
};

export type SearchState = {
  items: Anime[];
  loading: boolean;
  error: string | null;
  hasNext: boolean;
  q: string;
  page: number;
};

const initialState: SearchState = {
  items: [],
  loading: false,
  error: null,
  hasNext: false,
  q: '',
  page: 1,
};

export const fetchAnimeList = createAsyncThunk<
  { items: Anime[]; hasNext: boolean; q: string; page: number },
  SearchParams
>(
  'search/fetchAnimeList',
  async (
    { q, page, limit = 24, type, year, score, status, rating, orderBy, sort },
    { signal }
  ) => {
    const base = 'https://api.jikan.moe/v4';
    /* istanbul ignore next */ console.log({
      q,
      page,
      limit,
      type,
      year,
      score,
      status,
      rating,
      orderBy,
      sort,
    });
    const hasFilters = Boolean(
      (type && type !== 'any') ||
        year ||
        score ||
        /* istanbul ignore next */ (status && status !== 'any') ||
        /* istanbul ignore next */ (rating && rating !== 'any') ||
        orderBy ||
        sort
    );

    const params: string[] = [`limit=${limit}`, `page=${page}`];

    if (q) params.push(`q=${encodeURIComponent(q)}`);
    // Filters mapping for search endpoint
    if (type && type !== 'any') params.push(`type=${encodeURIComponent(type)}`);
    if (status && status !== 'any')
      params.push(`status=${encodeURIComponent(status)}`);
    if (rating && rating !== 'any')
      params.push(`rating=${encodeURIComponent(rating)}`);
    if (typeof score === 'number' && score >= 1 && score <= 10)
      params.push(`min_score=${score}`);
    if (typeof year === 'number' && year > 1900) {
      params.push(`start_date=${year}-01-01`);
      params.push(`end_date=${year}-12-31`);
    }

    // Sorting
    const order = orderBy && orderBy !== 'none' ? orderBy : 'score';
    const direction: 'asc' | 'desc' =
      sort === 'asc' || sort === 'desc' ? sort : 'desc';
    /* istanbul ignore next */ console.log('order', order);
    // Choose endpoint: if there is query or filters, use search endpoint; else top endpoint
    const useSearchEndpoint = q || hasFilters;
    const url = useSearchEndpoint
      ? `${base}/anime?${params.join(
          '&'
        )}&sfw=true&order_by=${encodeURIComponent(order)}&sort=${direction}`
      : `${base}/top/anime?${params.join('&')}`;
    /* istanbul ignore next */ console.log('url', url);
    const res = await fetch(url, { signal });
    const data: AnimeSearchResponse = await res.json();
    return {
      items: data.data,
      hasNext: Boolean(data.pagination?.has_next_page),
      q,
      page,
    };
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.q = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    reset(state) {
      state.items = [];
      state.loading = false;
      state.error = null;
      state.hasNext = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimeList.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        // Track args for coherence
        const { q, page } = action.meta.arg;
        state.q = q;
        state.page = page;
      })
      .addCase(fetchAnimeList.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.hasNext = action.payload.hasNext;
        state.q = action.payload.q;
        state.page = action.payload.page;
      })
      .addCase(fetchAnimeList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch anime';
      });
  },
});

export const { setQuery, setPage, reset } = searchSlice.actions;
export default searchSlice.reducer;
