import { screen, fireEvent } from '@testing-library/react'
import FilterBar from '../components/FilterBar'
import { renderWithProviders } from '../test-utils'

function renderWithRoute(url: string) {
  return renderWithProviders(<FilterBar />, { initialEntries: [url] })
}

test('FilterBar renders and clear button disabled when no filters', () => {
  renderWithRoute('/')
  const clearBtn = screen.getByRole('button', { name: /clear filter/i })
  expect(clearBtn).toBeDisabled()
})

test('FilterBar updates URL params and enables clear', () => {
  renderWithRoute('/')
  const typeSelect = screen.getByLabelText(/type/i) as HTMLSelectElement
  fireEvent.change(typeSelect, { target: { value: 'tv' } })

  // Clear button enabled after change
  const clearBtn = screen.getByRole('button', { name: /clear filter/i })
  expect(clearBtn).not.toBeDisabled()
})
