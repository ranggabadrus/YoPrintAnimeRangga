import { screen } from '@testing-library/react'
import AnimeCard from '../components/AnimeCard'
import { renderWithProviders } from '../test-utils'

const base = {
  mal_id: 99,
  url: 'https://example.com/99',
  images: { jpg: {}, webp: {} },
  title: 'No Image Anime',
} as any

test('AnimeCard shows fallback when no image and hides score badge when score is not a number', () => {
  renderWithProviders(<AnimeCard anime={base} />)
  expect(screen.getByText('No Image')).toBeInTheDocument()
  // No score badge
  expect(screen.queryByText(/⭐/)).toBeNull()
})
