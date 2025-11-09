import reducer, { fetchAnimeById } from '../store/detailSlice'

describe('detailSlice', () => {
  it('should handle pending/fulfilled/rejected per id', () => {
    const initial = reducer(undefined, { type: '@@INIT' } as any)
    const id = '123'

    const pending = reducer(initial, { type: fetchAnimeById.pending.type, meta: { arg: id } as any })
    expect(pending.loadingById[id]).toBe(true)
    expect(pending.errorById[id]).toBe(null)

    const anime: any = { mal_id: 123, url: '', images: { jpg: {} }, title: 'X' }
    const fulfilled = reducer(pending, { type: fetchAnimeById.fulfilled.type, payload: { id, anime } })
    expect(fulfilled.loadingById[id]).toBe(false)
    expect(fulfilled.entities[id]).toEqual(anime)

    const rejected = reducer(fulfilled, { type: fetchAnimeById.rejected.type, meta: { arg: id }, error: { message: 'oops' } as any })
    expect(rejected.loadingById[id]).toBe(false)
    expect(rejected.errorById[id]).toBe('oops')
  })
})
