import type { ThemePreference } from '../context/theme-context'
import { useTheme } from '../context/useTheme'

const labels: Record<ThemePreference, string> = {
  system: 'Sistema',
  light: 'Claro',
  dark: 'Oscuro',
}

const order: ThemePreference[] = ['system', 'light', 'dark']

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const cycle = () => {
    const next = order[(order.indexOf(theme) + 1) % order.length]
    setTheme(next)
  }

  return (
    <button type="button" className="btn btn-secondary" onClick={cycle} title="Cambiar tema">
      {labels[theme]}
    </button>
  )
}
