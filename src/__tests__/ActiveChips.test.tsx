import { screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { render } from '@testing-library/react'
import ActiveChips from '../components/ActiveChips'

function WithLocation() {
  const loc = useLocation()
  return <div data-testid="loc">{loc.pathname + loc.search}</div>
}

function renderChips(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <WithLocation />
      <ActiveChips />
    </MemoryRouter>
  )
}

test('renders chips for active params and clears each to page=1', () => {
  renderChips('/?q=naruto&type=tv&status=airing&rating=pg13&score=8&year=2010&order_by=members&sort=asc&page=5')

  // All expected chips present
  expect(screen.getByText(/q:/i)).toBeInTheDocument()
  expect(screen.getByText(/type:/i)).toBeInTheDocument()
  expect(screen.getByText(/status:/i)).toBeInTheDocument()
  expect(screen.getByText(/rating:/i)).toBeInTheDocument()
  expect(screen.getByText(/score:/i)).toBeInTheDocument()
  expect(screen.getByText(/year:/i)).toBeInTheDocument()
  expect(screen.getByText(/order by:/i)).toBeInTheDocument()
  expect(screen.getByText(/sort:/i)).toBeInTheDocument()

  // Clear type
  fireEvent.click(screen.getByRole('button', { name: /clear type/i }))
  expect(screen.getByTestId('loc').textContent).not.toContain('type=')
  expect(screen.getByTestId('loc').textContent).toContain('page=1')

  // Clear q
  fireEvent.click(screen.getByRole('button', { name: /clear q/i }))
  expect(screen.getByTestId('loc').textContent).not.toContain('q=')

  // Clear rating
  fireEvent.click(screen.getByRole('button', { name: /clear rating/i }))
  expect(screen.getByTestId('loc').textContent).not.toContain('rating=')
})

test('renders nothing when there are no active params', () => {
  renderChips('/')
  expect(screen.queryByLabelText(/active filters/i)).toBeNull()
})
