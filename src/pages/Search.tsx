import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import AnimeCard from '../components/AnimeCard';
import { useDebounce } from '../hooks/useDebounce';
import Pagination from '../components/Pagination';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchAnimeList,
  setPage as setPageAction,
  setQuery as setQueryAction,
} from '../store/searchSlice';
import FilterBar from '../components/FilterBar';
import ActiveChips from '../components/ActiveChips';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const qParam = params.get('q') ?? '';
  const pageParam = Math.max(1, Number(params.get('page') ?? '1'));
  // Filters from URL
  const typeParam = params.get('type');
  const statusParam = params.get('status');
  const ratingParam = params.get('rating');
  const scoreParam = params.get('score');
  const yearParam = params.get('year');
  const orderByParam = params.get('order_by');
  const sortParam = params.get('sort');
  const term = useDebounce(qParam, 250);
  const dispatch = useAppDispatch();
  const { items, loading, error, hasNext, q, page } = useAppSelector(
    (s) => s.search
  );

  useEffect(() => {
    // Keep store in sync with URL params
    if (q !== term) dispatch(setQueryAction(term));
    if (page !== pageParam) dispatch(setPageAction(pageParam));

    const score = scoreParam ? Number(scoreParam) : null;
    const year = yearParam ? Number(yearParam) : null;
    dispatch(
      fetchAnimeList({
        q: term,
        page: pageParam,
        limit: 24,
        type: typeParam,
        status: statusParam,
        rating: ratingParam,
        score: Number.isFinite(score as number) ? (score as number) : null,
        year: Number.isFinite(year as number) ? (year as number) : null,
        orderBy: orderByParam,
        sort: sortParam as 'asc' | 'desc' | null,
      })
    );
  }, [
    dispatch,
    term,
    pageParam,
    typeParam,
    statusParam,
    ratingParam,
    scoreParam,
    yearParam,
    orderByParam,
    sortParam,
  ]);

  const empty = !loading && !error && items.length === 0;

  const headerText = useMemo(
    () => (qParam ? `Results for "${qParam}"` : 'Top Anime'),
    [qParam]
  );

  return (
    <main className="container">
      <FilterBar />
      <ActiveChips />
      <h2 style={{ marginBottom: 12 }}>{headerText}</h2>
      <div className="grid">
        {loading &&
          Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton" />
          ))}
        {!loading &&
          !error &&
          items.map((a) => <AnimeCard key={a.mal_id} anime={a} />)}
        {error && <div className="error">{error}</div>}
        {empty && <div className="muted">No results found.</div>}
      </div>
      {!empty && (
        <div
          style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}
        >
          <Pagination
            page={pageParam}
            hasNext={hasNext}
            onPrev={() => {
              const next = new URLSearchParams(params);
              const prevPage = Math.max(1, pageParam - 1);
              next.set('page', String(prevPage));
              setParams(next, { replace: true });
            }}
            onNext={() => {
              if (!hasNext) return;
              const next = new URLSearchParams(params);
              next.set('page', String(pageParam + 1));
              setParams(next, { replace: true });
            }}
          />
        </div>
      )}
    </main>
  );
}
