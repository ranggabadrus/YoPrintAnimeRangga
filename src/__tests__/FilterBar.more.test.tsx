import { screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import FilterBar from '../components/FilterBar'
import { render } from '@testing-library/react'

function WithLocation() {
  const loc = useLocation()
  return <div data-testid="loc">{loc.pathname + loc.search}</div>
}

function renderWithRoute(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <WithLocation />
      <FilterBar />
    </MemoryRouter>
  )
}

test('initial values reflect URL params and hasAny controls Clear button disabled', () => {
  renderWithRoute('/?type=tv&status=airing&rating=pg&score=7&year=2010&order_by=members&sort=asc')
  expect((screen.getByLabelText(/Type/i) as HTMLSelectElement).value).toBe('tv')
  expect((screen.getByLabelText(/Status/i) as HTMLSelectElement).value).toBe('airing')
  expect((screen.getByLabelText(/Rating/i) as HTMLSelectElement).value).toBe('pg')
  expect((screen.getByLabelText(/Min Score/i) as HTMLSelectElement).value).toBe('7')
  expect((screen.getByLabelText(/Year/i) as HTMLSelectElement).value).toBe('2010')
  expect((screen.getByLabelText(/Order by/i) as HTMLSelectElement).value).toBe('members')
  expect((screen.getByLabelText(/^Order$/i) as HTMLSelectElement).value).toBe('asc')
  // With params, clear should be enabled
  expect(screen.getByRole('button', { name: /clear filter/i })).not.toBeDisabled()
})

test('changing filters sets params and resets page=1; clear removes filters', () => {
  renderWithRoute('/')
  const clear = screen.getByRole('button', { name: /clear filter/i })
  expect(clear).toBeDisabled()

  fireEvent.change(screen.getByLabelText(/Type/i), { target: { value: 'movie' } })
  expect(screen.getByTestId('loc').textContent).toContain('type=movie')
  expect(screen.getByTestId('loc').textContent).toContain('page=1')
  expect(clear).not.toBeDisabled()

  fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: 'complete' } })
  expect(screen.getByTestId('loc').textContent).toContain('status=complete')

  fireEvent.change(screen.getByLabelText(/Rating/i), { target: { value: 'pg13' } })
  expect(screen.getByTestId('loc').textContent).toContain('rating=pg13')

  fireEvent.change(screen.getByLabelText(/Min Score/i), { target: { value: '8' } })
  expect(screen.getByTestId('loc').textContent).toContain('score=8')

  fireEvent.change(screen.getByLabelText(/Year/i), { target: { value: '2015' } })
  expect(screen.getByTestId('loc').textContent).toContain('year=2015')

  fireEvent.change(screen.getByLabelText(/Order by/i), { target: { value: 'rank' } })
  expect(screen.getByTestId('loc').textContent).toContain('order_by=rank')

  fireEvent.change(screen.getByLabelText(/^Order$/i), { target: { value: 'desc' } })
  expect(screen.getByTestId('loc').textContent).toContain('sort=desc')

  // Now clear all should wipe filter params and set page=1
  fireEvent.click(clear)
  const url = screen.getByTestId('loc').textContent!
  expect(url).not.toMatch(/type|status|rating|score|year|order_by|sort/)
  expect(url).toContain('page=1')
})

test("selecting 'any' removes the param and keeps page=1", () => {
  renderWithRoute('/?type=movie&status=complete&rating=pg13&score=9&year=2016&order_by=rank&sort=desc')

  // Set each to 'any' or blank and verify URL params removed
  fireEvent.change(screen.getByLabelText(/Type/i), { target: { value: 'any' } })
  expect(screen.getByTestId('loc').textContent).not.toContain('type=')
  expect(screen.getByTestId('loc').textContent).toContain('page=1')

  fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: 'any' } })
  expect(screen.getByTestId('loc').textContent).not.toContain('status=')

  fireEvent.change(screen.getByLabelText(/Rating/i), { target: { value: 'any' } })
  expect(screen.getByTestId('loc').textContent).not.toContain('rating=')

  fireEvent.change(screen.getByLabelText(/Min Score/i), { target: { value: '' } })
  expect(screen.getByTestId('loc').textContent).not.toContain('score=')

  fireEvent.change(screen.getByLabelText(/Year/i), { target: { value: '' } })
  expect(screen.getByTestId('loc').textContent).not.toContain('year=')

  fireEvent.change(screen.getByLabelText(/Order by/i), { target: { value: '' } })
  expect(screen.getByTestId('loc').textContent).not.toContain('order_by=')

  fireEvent.change(screen.getByLabelText(/^Order$/i), { target: { value: '' } })
  expect(screen.getByTestId('loc').textContent).not.toContain('sort=')
})
