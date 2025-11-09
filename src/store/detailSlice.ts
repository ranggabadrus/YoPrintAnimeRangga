import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { Anime } from '../types/anime'

export type DetailState = {
  entities: Record<string, Anime>
  loadingById: Record<string, boolean>
  errorById: Record<string, string | null>
}

const initialState: DetailState = {
  entities: {},
  loadingById: {},
  errorById: {},
}

export const fetchAnimeById = createAsyncThunk<
  { id: string; anime: Anime },
  string
>(
  'detail/fetchById',
  async (id: string, { signal }) => {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`, { signal })
    const data: { data: Anime } = await res.json()
    return { id, anime: data.data }
  }
)

const detailSlice = createSlice({
  name: 'detail',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimeById.pending, (state, action) => {
        const id = action.meta.arg
        state.loadingById[id] = true
        state.errorById[id] = null
      })
      .addCase(fetchAnimeById.fulfilled, (state, action) => {
        const { id, anime } = action.payload
        state.entities[id] = anime
        state.loadingById[id] = false
        state.errorById[id] = null
      })
      .addCase(fetchAnimeById.rejected, (state, action) => {
        const id = action.meta.arg
        state.loadingById[id] = false
        state.errorById[id] = action.error.message ?? 'Failed to load'
      })
  },
})

export default detailSlice.reducer
