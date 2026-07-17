'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '../Button'
import { useTheme } from './useTheme'
import type { ThemeToggleProps } from './ThemeToggle.types'

export function ThemeToggle(props: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Alternar tema"
      onClick={toggleTheme}
      {...props}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
    </Button>
  )
}
