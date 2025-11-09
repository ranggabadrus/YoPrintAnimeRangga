import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { store } from './store'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { MemoryRouterProps } from 'react-router-dom'

export function renderWithProviders(ui: ReactElement, routerProps?: MemoryRouterProps) {
  return render(
    <Provider store={store}>
      <MemoryRouter {...routerProps}>{ui}</MemoryRouter>
    </Provider>
  )
}
