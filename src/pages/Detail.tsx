import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAnimeById } from '../store/detailSlice';

export default function DetailPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const anime = useAppSelector((s) => (id ? s.detail.entities[id] : undefined));
  const loading = useAppSelector((s) => (id ? Boolean(s.detail.loadingById[id]) : false));
  const error = useAppSelector((s) => (id ? s.detail.errorById[id] ?? null : null));

  useEffect(() => {
    if (!id) return;
    // If it's already cached, skip fetching
    if (anime) return;
    const promise = dispatch(fetchAnimeById(id));
    return () => {
      promise.abort();
    };
  }, [id]);

  if (loading)
    return (
      <main className="container">
        <div className="muted">Loading...</div>
      </main>
    );
  if (error)
    return (
      <main className="container">
        <div className="error">{error}</div>
      </main>
    );
  if (!anime) return null;

  const img =
    anime.images.webp?.large_image_url ||
    anime.images.webp?.image_url ||
    anime.images.jpg?.large_image_url ||
    anime.images.jpg?.image_url ||
    '';

  return (
    <main className="container-detail">
      <Link to="/" className="back">
        ← Back to search
      </Link>
      <section className="detail">
        <div className="poster">
          {img ? (
            <img src={img} alt={anime.title} />
          ) : (
            <div className="noimg">No Image</div>
          )}
        </div>
        <div className="info">
          <h1 style={{ marginTop: 0 }}>{anime.title}</h1>
          {anime.score && (
            <div className="badge">⭐ {anime.score.toFixed(1)}</div>
          )}
          <ul className="meta">
            {anime.type && (
              <li>
                <strong>Type:</strong> {anime.type}
              </li>
            )}
            {typeof anime.episodes === 'number' && (
              <li>
                <strong>Episodes:</strong> {anime.episodes}
              </li>
            )}
            {anime.year && (
              <li>
                <strong>Year:</strong> {anime.year}
              </li>
            )}
          </ul>
          {anime.synopsis && <p className="synopsis">{anime.synopsis}</p>}
          <a href={anime.url} target="_blank" rel="noreferrer" className="link">
            View on MyAnimeList →
          </a>
        </div>
      </section>
    </main>
  );
}
