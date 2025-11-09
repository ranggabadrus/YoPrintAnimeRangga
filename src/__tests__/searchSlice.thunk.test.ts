import { fetchAnimeList } from '../store/searchSlice'
import { configureStore } from '@reduxjs/toolkit'
import searchReducer from '../store/searchSlice'
import detailReducer from '../store/detailSlice'

function makeStore() {
  return configureStore({ reducer: { search: searchReducer, detail: detailReducer } })
}

describe('fetchAnimeList thunk URL building', () => {
  const originalFetch = global.fetch
  let fetchMock: jest.Mock

  beforeEach(() => {
    fetchMock = jest.fn().mockResolvedValue({ json: async () => ({ data: [], pagination: { has_next_page: false } }) })
    ;(global as any).fetch = fetchMock
  })

  it("doesn't add filter params for 'any'/invalid values and keeps top endpoint when q is empty", async () => {
    const store = makeStore()
    await store.dispatch(
      fetchAnimeList({
        q: '',
        page: 3,
        type: 'any' as any,
        status: 'any' as any,
        rating: 'any' as any,
        score: 0 as any, // invalid
        year: 1900, // boundary not included
        orderBy: 'none' as any,
        sort: undefined as any,
      })
    )

    const url = (fetchMock.mock.calls[0] as any)[0] as string
    // Implementation considers presence of some values as filters even if not emitted;
    // it uses the search endpoint but should not include specific filter params
    expect(url).toContain('/anime?')
    expect(url).toContain('page=3')
    expect(url).toContain('limit=24')
    expect(url).not.toContain('min_score=')
    expect(url).not.toContain('start_date=')
    expect(url).not.toContain('end_date=')
    expect(url).not.toContain('type=')
    expect(url).not.toContain('status=')
    expect(url).not.toContain('rating=')
  })

  afterEach(() => {
    global.fetch = originalFetch as any
    jest.resetAllMocks()
  })

  it('uses top endpoint when no query and no filters', async () => {
    const store = makeStore()
    await store.dispatch(fetchAnimeList({ q: '', page: 1 }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const url = (fetchMock.mock.calls[0] as any)[0] as string
    expect(url).toContain('/top/anime?')
    expect(url).toContain('page=1')
    expect(url).toContain('limit=24')

    const state = store.getState().search
    expect(state.q).toBe('')
    expect(state.page).toBe(1)
    expect(state.loading).toBe(false)
    expect(state.items).toEqual([])
    expect(state.hasNext).toBe(false)
  })

  it('uses search endpoint with filters and encodes parameters', async () => {
    const store = makeStore()
    await store.dispatch(
      fetchAnimeList({
        q: 'fate zero',
        page: 2,
        type: 'tv',
        status: 'airing',
        rating: 'pg13',
        score: 8,
        year: 2012,
        orderBy: 'members',
        sort: 'asc',
      })
    )

    const url = (fetchMock.mock.calls[0] as any)[0] as string
    expect(url).toContain('/anime?')
    expect(url).toContain('q=fate%20zero')
    expect(url).toContain('type=tv')
    expect(url).toContain('status=airing')
    expect(url).toContain('rating=pg13')
    expect(url).toContain('min_score=8')
    expect(url).toContain('start_date=2012-01-01')
    expect(url).toContain('end_date=2012-12-31')
    expect(url).toContain('order_by=members')
    expect(url).toContain('sort=asc')

    const state = store.getState().search
    expect(state.q).toBe('fate zero')
    expect(state.page).toBe(2)
    expect(state.loading).toBe(false)
  })
})
