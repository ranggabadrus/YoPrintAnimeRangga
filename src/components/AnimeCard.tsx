import { Link } from 'react-router-dom';
import type { Anime } from '../types/anime';

type Props = { anime: Anime };

export default function AnimeCard({ anime }: Props) {
  const img =
    anime.images.webp?.large_image_url ||
    anime.images.webp?.image_url ||
    anime.images.jpg?.large_image_url ||
    anime.images.jpg?.image_url ||
    '';

  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className="card-item"
      aria-label={anime.title}
    >
      <div className="thumb">
        {img ? (
          <img src={img} alt={anime.title} loading="lazy" />
        ) : (
          <div className="noimg">No Image</div>
        )}
      </div>
      <div className="card-body">
        <h3 title={anime.title}>{anime.title}</h3>
        {typeof anime.score === 'number' && (
          <span className="badge">⭐ {anime.score.toFixed(1)}</span>
        )}
      </div>
    </Link>
  );
}
