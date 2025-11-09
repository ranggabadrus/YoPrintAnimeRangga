import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import '../index.css';
import { useTheme } from '../hooks/useTheme';

export default function Header() {
  const [params, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [term, setTerm] = useState<string>('');
  const { theme, toggle } = useTheme();

  useEffect(() => {
    setTerm(params.get('q') ?? '');
  }, [params]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = term.trim();
    navigate(q ? `/?q=${encodeURIComponent(q)}` : '/');
  };

  const onChange = (value: string) => {
    setTerm(value);
    const q = value.trim();
    const next = new URLSearchParams(params);
    if (q) next.set('q', q);
    else next.delete('q');
    // Reset pagination when query changes
    next.set('page', '1');
    setSearchParams(next, { replace: true });
  };

  return (
    <header className="container">
      <div className="nav">
        <div className="nav-left">
          <button
            type="button"
            aria-label={`Toggle theme (currently ${theme})`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            onClick={toggle}
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          <Link to="/" className="brand">
            YoPrint Anime
          </Link>
        </div>
        <form onSubmit={onSubmit} className="searchbar">
          <input
            value={term}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search anime..."
            aria-label="Search anime"
          />
        </form>
      </div>
    </header>
  );
}
