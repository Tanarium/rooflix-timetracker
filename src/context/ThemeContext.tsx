import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ThemeContext, type ThemePreference } from './theme-context'

const STORAGE_KEY = 'rooflix-theme'

function readStoredTheme(): ThemePreference {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : 'system'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>(readStoredTheme)

  useEffect(() => {
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme])

  const setTheme = useCallback((next: ThemePreference) => {
    setThemeState(next)
    if (next === 'system') {
      localStorage.removeItem(STORAGE_KEY)
    } else {
      localStorage.setItem(STORAGE_KEY, next)
    }
  }, [])

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
