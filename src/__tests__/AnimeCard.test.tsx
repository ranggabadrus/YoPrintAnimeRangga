import { screen } from '@testing-library/react';
import AnimeCard from '../components/AnimeCard';
import { renderWithProviders } from '../test-utils';

const anime = {
  mal_id: 42,
  url: 'https://example.com/42',
  images: { jpg: { image_url: 'http://img' } },
  title: 'Test Anime',
  score: 8.5,
} as any;

it('renders AnimeCard with title and link', () => {
  renderWithProviders(<AnimeCard anime={anime} />);
  expect(screen.getByText('Test Anime')).toBeInTheDocument();
  const link = screen.getByRole('link') as HTMLAnchorElement;
  expect(link.getAttribute('href')).toBe('/anime/42');
});
