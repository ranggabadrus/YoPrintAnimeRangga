import { screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import { render } from '@testing-library/react'

// Provide a stable toggle mock and a mutable theme value to cover branches
const toggleMock = jest.fn()
let currentTheme: 'light' | 'dark' = 'light'
jest.mock('../hooks/useTheme', () => ({
  useTheme: () => ({ theme: currentTheme, toggle: toggleMock }),
}))

function WithLocation() {
  const loc = useLocation()
  return <div data-testid="loc">{loc.pathname + loc.search}</div>
}

function renderHeader(initialEntries: string[] = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <WithLocation />
      <Header />
    </MemoryRouter>
  )
}

test('renders brand and theme toggle, clicking toggle calls handler', () => {
  renderHeader(['/'])
  expect(screen.getByText(/YoPrint Anime/i)).toBeInTheDocument()

  const btn = screen.getByRole('button', { name: /toggle theme/i })
  fireEvent.click(btn)
  expect(toggleMock).toHaveBeenCalled()
})

test('typing in search updates input and sets page to 1 in URL', () => {
  renderHeader(['/'])
  const input = screen.getByLabelText(/search anime/i) as HTMLInputElement
  fireEvent.change(input, { target: { value: 'naruto' } })
  // URL should reflect q and page=1 (replace)
  expect(screen.getByTestId('loc')).toHaveTextContent('/?q=naruto&page=1')
})

test('submit navigates to /?q=encoded when term has value and to / when blank', () => {
  renderHeader(['/'])
  const input = screen.getByLabelText(/search anime/i) as HTMLInputElement
  fireEvent.change(input, { target: { value: 'fate zero' } })
  fireEvent.submit(input.closest('form')!)
  expect(screen.getByTestId('loc')).toHaveTextContent('/?q=fate%20zero')

  // clear and submit blank -> navigate to /
  fireEvent.change(input, { target: { value: '   ' } })
  fireEvent.submit(input.closest('form')!)
  expect(screen.getByTestId('loc')).toHaveTextContent('/')
})
