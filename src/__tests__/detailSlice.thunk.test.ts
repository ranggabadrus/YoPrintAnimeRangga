import { configureStore } from '@reduxjs/toolkit'
import reducer, { fetchAnimeById } from '../store/detailSlice'

function makeStore() {
  return configureStore({ reducer: { detail: reducer } })
}

describe('fetchAnimeById thunk', () => {
  const originalFetch = global.fetch
  let fetchMock: jest.Mock

  beforeEach(() => {
    fetchMock = jest.fn().mockResolvedValue({ json: async () => ({ data: { mal_id: 7 } }) })
    ;(global as any).fetch = fetchMock
  })

  afterEach(() => {
    global.fetch = originalFetch as any
    jest.resetAllMocks()
  })

  it('fetches by id and populates entities, toggles loading and clears error', async () => {
    const store = makeStore()

    const id = '7'
    // Dispatch thunk
    await store.dispatch(fetchAnimeById(id))

    const st = store.getState().detail
    expect(fetchMock).toHaveBeenCalledWith(`https://api.jikan.moe/v4/anime/${id}`, expect.any(Object))
    expect(st.entities[id]).toEqual({ mal_id: 7 })
    expect(st.loadingById[id]).toBe(false)
    expect(st.errorById[id]).toBeNull()
  })

  it('handles rejected without message using default error text', async () => {
    ;(global as any).fetch = jest.fn().mockRejectedValue(new Error())
    const store = makeStore()
    const id = '404'

    // Manually simulate pending then rejected to ensure reducers execute
    store.dispatch({ type: fetchAnimeById.pending.type, meta: { arg: id } })
    store.dispatch({ type: fetchAnimeById.rejected.type, meta: { arg: id }, error: {} as any })

    const st = store.getState().detail
    expect(st.loadingById[id]).toBe(false)
    expect(st.errorById[id]).toBe('Failed to load')
  })
})
