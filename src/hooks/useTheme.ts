import { useCallback, useEffect, useMemo, useState } from 'react'

type StoredTheme = 'light' | 'dark' | null

const STORAGE_KEY = 'theme'

export function useTheme() {
  const getStored = (): StoredTheme => {
    const v = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
    return v === 'light' || v === 'dark' ? v : null
  }

  const [stored, setStored] = useState<StoredTheme>(getStored())
  const systemDark = useMemo(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }, [])

  const effective: 'light' | 'dark' = stored ?? (systemDark ? 'dark' : 'light')

  // Apply to documentElement
  useEffect(() => {
    const root = document.documentElement
    if (stored) {
      root.setAttribute('data-theme', stored)
    } else {
      root.removeAttribute('data-theme') // fall back to system
    }
  }, [stored])

  const toggle = useCallback(() => {
    const next: 'light' | 'dark' = effective === 'dark' ? 'light' : 'dark'
    setStored(next)
    try { window.localStorage.setItem(STORAGE_KEY, next) } catch {}
  }, [effective])

  const resetToSystem = useCallback(() => {
    setStored(null)
    try { window.localStorage.removeItem(STORAGE_KEY) } catch {}
  }, [])

  return { theme: effective, stored, setStored, toggle, resetToSystem }
}
