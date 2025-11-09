import { screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from '../components/Header'
import { render } from '@testing-library/react'

// Mock useTheme to force dark theme and verify moon icon and title
jest.mock('../hooks/useTheme', () => ({
  useTheme: () => ({ theme: 'dark', toggle: jest.fn() }),
}))

test('Header shows moon icon and light mode title when theme is dark', () => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  )
  const btn = screen.getByRole('button', { name: /toggle theme/i })
  expect(btn).toHaveTextContent('🌙')
  expect(btn).toHaveAttribute('title', expect.stringMatching(/light/i))
})
