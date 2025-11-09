import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

// Simple pill style using inline styles to avoid CSS changes
const chipStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '4px 8px',
  borderRadius: '999px',
  background: 'var(--chip-bg, #efefef)',
  border: '1px solid #ddd',
  fontSize: '0.9rem',
};

const closeBtnStyle: React.CSSProperties = {
  cursor: 'pointer',
  border: 'none',
  background: 'transparent',
  lineHeight: 1,
  fontSize: '0.9rem',
};

export default function ActiveChips() {
  const [params, setParams] = useSearchParams();

  const items = useMemo(() => {
    const list: Array<{ key: string; label: string; value: string }> = [];
    const entries: Array<[string, (v: string | null) => string | undefined]> = [
      ['q', (v) => (v ? v : undefined)],
      ['type', (v) => (v && v !== 'any' ? v : undefined)],
      ['status', (v) => (v && v !== 'any' ? v : undefined)],
      ['rating', (v) => (v && v !== 'any' ? v : undefined)],
      ['score', (v) => (v ? v : undefined)],
      ['year', (v) => (v ? v : undefined)],
      ['order_by', (v) => (v ? v : undefined)],
      ['sort', (v) => (v ? v : undefined)],
    ];

    for (const [key, mapFn] of entries) {
      const raw = params.get(key);
      const val = mapFn(raw);
      if (val) {
        const nice = key === 'order_by' ? 'order by' : key;
        list.push({ key, label: nice, value: val });
      }
    }
    return list;
  }, [params]);

  const clearKey = (key: string) => {
    clearParam(params, setParams, key);
  };

  // Separate handler factory helps Istanbul attribute coverage correctly
  function makeClearHandler(key: string) {
    return () => clearKey(key);
  }

  if (items.length === 0) return null;

  return (
    <div
      aria-label="Active filters"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        margin: '10px 0 6px',
      }}
    >
      {items.map(({ key, label, value }) => (
        <span key={key} style={chipStyle}>
          <span style={{ textTransform: 'capitalize' }}>
            {label && label === 'q' ? 'Search' : label}:
          </span>
          <strong>{value}</strong>
          <button
            type="button"
            aria-label={`Clear ${label}`}
            title={`Clear ${label}`}
            onClick={makeClearHandler(key)}
            style={closeBtnStyle}
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}

// Exported helper for unit coverage
export function clearParam(
  params: URLSearchParams,
  setParams: (next: URLSearchParams, opts: { replace: boolean }) => void,
  key: string
) {
  const next = new URLSearchParams(params);
  next.delete(key);
  next.set('page', '1');
  setParams(next, { replace: true });
}
