import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

const TYPES = [
  'any',
  'tv',
  'movie',
  'ova',
  'special',
  'ona',
  'music',
  'cm',
  'pv',
  'tv_special',
] as const;
const STATUSES = ['any', 'airing', 'complete', 'upcoming'] as const;
const RATINGS = ['any', 'g', 'pg', 'pg13', 'r17', 'r', 'rx'] as const;
const ORDER_BY = [
  'mal_id',
  'title',
  'start_date',
  'end_date',
  'episodes',
  'score',
  'rank',
  'popularity',
  'members',
] as const;
const ORDER_DIR = ['desc', 'asc'] as const;

export default function FilterBar() {
  const [params, setParams] = useSearchParams();

  const values = useMemo(() => {
    const type = params.get('type') ?? 'any';
    const status = params.get('status') ?? 'any';
    const rating = params.get('rating') ?? 'any';
    const score = params.get('score') ?? '';
    const year = params.get('year') ?? '';
    const orderBy = params.get('order_by') ?? '';
    const sort = params.get('sort') ?? '';
    return { type, status, rating, score, year, orderBy, sort };
  }, [params]);

  const YEARS = useMemo(() => {
    const current = new Date().getFullYear();
    const list: number[] = [];
    for (let y = current; y >= 1950; y--) list.push(y);
    return list;
  }, []);

  const update = (key: string, val: string) => {
    const next = new URLSearchParams(params);
    if (val && val !== 'any') next.set(key, val);
    else next.delete(key);
    next.set('page', '1'); // reset pagination on filter change
    setParams(next, { replace: true });
  };

  const hasAny = useMemo(() => {
    return (
      (params.get('type') ?? '') !== '' ||
      (params.get('status') ?? '') !== '' ||
      (params.get('rating') ?? '') !== '' ||
      (params.get('score') ?? '') !== '' ||
      (params.get('year') ?? '') !== '' ||
      (params.get('order_by') ?? '') !== '' ||
      (params.get('sort') ?? '') !== ''
    );
  }, [params]);

  const clearAll = () => {
    const next = new URLSearchParams(params);
    next.delete('type');
    next.delete('status');
    next.delete('rating');
    next.delete('score');
    next.delete('year');
    next.delete('order_by');
    next.delete('sort');
    next.set('page', '1');
    setParams(next, { replace: true });
  };

  return (
    <section className="filters" aria-label="Filters">
      <div className="filter">
        <label htmlFor="f-type">Type</label>
        <select
          id="f-type"
          value={values.type}
          onChange={(e) => update('type', e.target.value)}
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="filter">
        <label htmlFor="f-status">Status</label>
        <select
          id="f-status"
          value={values.status}
          onChange={(e) => update('status', e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="filter">
        <label htmlFor="f-rating">Rating</label>
        <select
          id="f-rating"
          value={values.rating}
          onChange={(e) => update('rating', e.target.value)}
        >
          {RATINGS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="filter">
        <label htmlFor="f-score">Min Score</label>
        <select
          id="f-score"
          value={values.score}
          onChange={(e) => update('score', e.target.value)}
        >
          <option value="">any</option>
          {Array.from({ length: 10 }, (_, i) => String(i + 1)).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="filter">
        <label htmlFor="f-year">Year</label>
        <select
          id="f-year"
          value={values.year}
          onChange={(e) => update('year', e.target.value)}
        >
          <option value="">any</option>
          {YEARS.map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="filter">
        <label htmlFor="f-order">Order by</label>
        <select
          id="f-order"
          value={values.orderBy}
          onChange={(e) => update('order_by', e.target.value)}
        >
          <option value="">default</option>
          {ORDER_BY.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <div className="filter">
        <label htmlFor="f-dir">Order</label>
        <select
          id="f-dir"
          value={values.sort}
          onChange={(e) => update('sort', e.target.value)}
        >
          <option value="">default</option>
          {ORDER_DIR.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginLeft: 'auto' }}>
        <button
          type="button"
          onClick={clearAll}
          disabled={!hasAny}
          title="Clear filters"
        >
          Clear Filter
        </button>
      </div>
    </section>
  );
}
