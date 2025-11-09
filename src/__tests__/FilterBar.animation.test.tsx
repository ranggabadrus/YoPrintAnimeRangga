import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FilterBar from '../components/FilterBar'

function renderFilter(initial = '/'){ 
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <FilterBar />
    </MemoryRouter>
  )
}

describe('FilterBar expand/minimize animation', () => {
  let rafSpy: jest.SpyInstance
  let cafSpy: jest.SpyInstance

  beforeEach(() => {
    // Make requestAnimationFrame run immediately
    rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: any) => {
      cb(0)
      return 1 as any
    })
    cafSpy = jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})

    // Control scrollHeight measurement using defineProperty
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get() {
        return 480
      },
    })
  })

  afterEach(() => {
    rafSpy.mockRestore()
    cafSpy.mockRestore()
    // restore scrollHeight
    delete (HTMLElement.prototype as any).scrollHeight
  })

  test('starts minimized: hidden with vertical collapsed styles, expands smoothly on click', () => {
    renderFilter()

    // Initially minimized -> only the Filters button
    const openBtn = screen.getByRole('button', { name: /filters/i })
    expect(openBtn).toBeInTheDocument()

    // The filters section exists in DOM but is aria-hidden and collapsed
    const section = screen.getByLabelText('Filters') as HTMLElement
    expect(section).toHaveAttribute('aria-hidden', 'true')
    const style1 = getComputedStyle(section)
    // opacity 0 and pointer-events: none
    expect(style1.opacity).toBe('0')
    expect(style1.pointerEvents).toBe('none')

    // Expand
    fireEvent.click(openBtn)

    // After expanding, aria-hidden=false and styles reflect visible state
    const style2 = getComputedStyle(section)
    expect(section).toHaveAttribute('aria-hidden', 'false')
    expect(style2.opacity).toBe('1')
    // We cannot read maxHeight numeric easily via getComputedStyle if inline numeric,
    // but we can assert pointer-events becomes auto and transform contains scaleY(1)
    expect(style2.pointerEvents).toBe('auto')
    expect(section.getAttribute('style') || '').toEqual(expect.stringContaining('scaleY(1)'))

    // Buttons inside should be visible now
    expect(screen.getByRole('button', { name: /hide filters/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /clear filter/i })).toBeInTheDocument()

    // Changing a filter triggers re-measure effect path while expanded
    const order = screen.getByLabelText(/^order$/i) as HTMLSelectElement
    fireEvent.change(order, { target: { value: 'asc' } })
  })

  test('hide filters collapses vertically (opacity 0, pointer-events none, scaleY<1)', () => {
    renderFilter()
    fireEvent.click(screen.getByRole('button', { name: /filters/i }))

    // Now hide
    fireEvent.click(screen.getByRole('button', { name: /hide filters/i }))

    const section = screen.getByLabelText('Filters') as HTMLElement
    const style = getComputedStyle(section)
    expect(section).toHaveAttribute('aria-hidden', 'true')
    expect(style.opacity).toBe('0')
    expect(style.pointerEvents).toBe('none')
    expect(section.getAttribute('style') || '').toEqual(expect.stringContaining('scaleY(0.98)'))
  })
})
