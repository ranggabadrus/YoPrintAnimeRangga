import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FilterBar from '../components/FilterBar'

function renderAt(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <FilterBar />
    </MemoryRouter>
  )
}

describe('FilterBar behavior', () => {
  test('expand, change each filter, and clear all', () => {
    renderAt('/?q=naruto&type=tv&status=airing&rating=pg13&score=7&year=2010&order_by=members&sort=asc&page=3')

    // Initially minimized -> open
    fireEvent.click(screen.getByRole('button', { name: /filters/i }))

    const type = screen.getByLabelText(/type/i) as HTMLSelectElement
    expect(type.value).toBe('tv')
    fireEvent.change(type, { target: { value: 'movie' } })

    const status = screen.getByLabelText(/status/i) as HTMLSelectElement
    expect(status.value).toBe('airing')
    fireEvent.change(status, { target: { value: 'complete' } })

    const rating = screen.getByLabelText(/rating/i) as HTMLSelectElement
    expect(rating.value).toBe('pg13')
    fireEvent.change(rating, { target: { value: 'r17' } })

    const score = screen.getByLabelText(/min score/i) as HTMLSelectElement
    expect(score.value).toBe('7')
    fireEvent.change(score, { target: { value: '8' } })

    const year = screen.getByLabelText(/year/i) as HTMLSelectElement
    expect(year.value).toBe('2010')
    fireEvent.change(year, { target: { value: '2012' } })

    const orderBy = screen.getByLabelText(/order by/i) as HTMLSelectElement
    expect(orderBy.value).toBe('members')
    fireEvent.change(orderBy, { target: { value: 'score' } })

    const sort = screen.getByLabelText(/^order$/i) as HTMLSelectElement
    expect(sort.value).toBe('asc')
    fireEvent.change(sort, { target: { value: 'desc' } })

    // Clear filters enabled
    const clearBtn = screen.getByRole('button', { name: /clear filter/i })
    expect(clearBtn).not.toBeDisabled()
    fireEvent.click(clearBtn)

    // After clearing, sort select still present and defaults
    expect((screen.getByLabelText(/^order$/i) as HTMLSelectElement).value).toBe('')
  })

  test('hide then show keeps interactive state transitions', () => {
    renderAt('/')

    // open, then hide
    fireEvent.click(screen.getByRole('button', { name: /filters/i }))
    fireEvent.click(screen.getByRole('button', { name: /hide filters/i }))

    const section = screen.getByLabelText('Filters')
    expect(section).toHaveAttribute('aria-hidden', 'true')

    // show again
    fireEvent.click(screen.getByRole('button', { name: /filters/i }))
    expect(screen.getByLabelText('Filters')).toHaveAttribute('aria-hidden', 'false')

    // When no filters, clear button is disabled
    expect(screen.getByRole('button', { name: /clear filter/i })).toBeDisabled()
  })
})
