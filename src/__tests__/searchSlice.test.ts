import reducer, {
  fetchAnimeList,
  setPage,
  setQuery,
  reset,
  type SearchState,
} from '../store/searchSlice';

describe('searchSlice', () => {
  const initial: SearchState = {
    items: [],
    loading: false,
    error: null,
    hasNext: false,
    q: '',
    page: 1,
  };

  it('should return initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' } as any)).toEqual(initial);
  });

  it('sets default error message when rejected without message', () => {
    const s1 = reducer(initial, {
      type: fetchAnimeList.rejected.type,
      error: {} as any,
      meta: { arg: { q: '', page: 1 } } as any,
    })
    expect(s1.loading).toBe(false)
    expect(s1.error).toBe('Failed to fetch anime')
  })

  it('reset clears items/loading/error/hasNext', () => {
    const populated: SearchState = {
      items: [{ mal_id: 1 } as any],
      loading: true,
      error: 'x',
      hasNext: true,
      q: 'abc',
      page: 5,
    }
    const next = reducer(populated, reset())
    expect(next.items).toEqual([])
    expect(next.loading).toBe(false)
    expect(next.error).toBeNull()
    expect(next.hasNext).toBe(false)
    // q and page unchanged by reset reducer
    expect(next.q).toBe('abc')
    expect(next.page).toBe(5)
  })

  it('setQuery and setPage update state', () => {
    let state = reducer(initial, setQuery('naruto'));
    state = reducer(state, setPage(3));
    expect(state.q).toBe('naruto');
    expect(state.page).toBe(3);
  });

  it('handles fetchAnimeList lifecycle', async () => {
    const okPayload = {
      data: [{ mal_id: 1, url: '', images: { jpg: {} }, title: 'A' }],
      pagination: {
        has_next_page: true,
        current_page: 1,
        items: { count: 1, total: 1, per_page: 24 },
      },
    };


    const pending = reducer(initial, {
      type: fetchAnimeList.pending.type,
      meta: { arg: { q: '', page: 1 } } as any,
    });
    expect(pending.loading).toBe(true);

    const fulfilled = reducer(pending, {
      type: fetchAnimeList.fulfilled.type,
      payload: { items: okPayload.data as any, hasNext: true, q: '', page: 1 },
    });
    expect(fulfilled.loading).toBe(false);
    expect(fulfilled.items.length).toBe(1);
    expect(fulfilled.hasNext).toBe(true);

    const rejected = reducer(fulfilled, {
      type: fetchAnimeList.rejected.type,
      error: { message: 'err' } as any,
    });
    expect(rejected.loading).toBe(false);
    expect(rejected.error).toBe('err');

    // no fetch mocking needed as we only test reducer responses to actions here
  });
});
