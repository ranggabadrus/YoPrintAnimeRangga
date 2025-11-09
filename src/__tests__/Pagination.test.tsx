import { screen } from '@testing-library/react'
import Pagination from '../components/Pagination'
import { render } from '@testing-library/react'

test('Pagination disables prev on page 1 and next when hasNext=false', () => {
  const onPrev = jest.fn()
  const onNext = jest.fn()
  render(<Pagination page={1} hasNext={false} onPrev={onPrev} onNext={onNext} />)

  const prev = screen.getByRole('button', { name: /prev/i })
  const next = screen.getByRole('button', { name: /next/i })
  expect(prev).toBeDisabled()
  expect(next).toBeDisabled()
})
