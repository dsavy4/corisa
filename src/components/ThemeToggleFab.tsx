import { useTheme } from './ThemeProvider'
import { Button } from './ui/button'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggleFab() {
  const { theme, setTheme } = useTheme()
  const isLight = theme === 'light'
  return (
    <div className="fixed top-4 right-4 z-50">
      <Button variant="ghost" size="icon" onClick={() => setTheme(isLight ? 'dark' : 'light')} title={isLight ? 'Switch to Dark' : 'Switch to Light'}>
        {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </Button>
    </div>
  )
}