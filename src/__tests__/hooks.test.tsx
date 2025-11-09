import { renderHook } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../store'
import { useAppDispatch, useAppSelector } from '../store/hooks'

function wrapper({ children }: any) {
  return <Provider store={store}>{children}</Provider>
}

test('useAppDispatch returns a dispatch function', () => {
  const { result } = renderHook(() => useAppDispatch(), { wrapper })
  expect(typeof result.current).toBe('function')
})

test('useAppSelector can read from store state', () => {
  const { result } = renderHook(() => useAppSelector((s) => s), { wrapper })
  expect(result.current).toHaveProperty('search')
  expect(result.current).toHaveProperty('detail')
})
