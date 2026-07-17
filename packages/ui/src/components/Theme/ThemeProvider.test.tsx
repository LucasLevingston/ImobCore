import { describe, expect, it, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { renderWithUser } from '../../test-utils'
import { ThemeProvider } from './ThemeProvider'
import { useTheme } from './useTheme'

function Consumer() {
  const { theme, setTheme, toggleTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button type="button" onClick={toggleTheme}>
        alternar
      </button>
      <button type="button" onClick={() => setTheme('dark')}>
        forçar escuro
      </button>
    </div>
  )
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('should default to light theme when there is no stored preference', () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('should read the initial theme from localStorage when present', () => {
    window.localStorage.setItem('ui-theme', 'dark')
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('should toggle the theme and persist it to localStorage', async () => {
    const { user } = renderWithUser(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'alternar' }))
    await waitFor(() => expect(screen.getByTestId('theme')).toHaveTextContent('dark'))
    expect(window.localStorage.getItem('ui-theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('should set an explicit theme via setTheme', async () => {
    const { user } = renderWithUser(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'forçar escuro' }))
    await waitFor(() => expect(screen.getByTestId('theme')).toHaveTextContent('dark'))
    expect(window.localStorage.getItem('ui-theme')).toBe('dark')
  })

  it('should fall back to the system preference (dark) when there is no stored theme', () => {
    const matchMedia = vi.fn().mockReturnValue({ matches: true })
    vi.stubGlobal('matchMedia', matchMedia)

    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    )

    expect(matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    vi.unstubAllGlobals()
  })

  it('should fall back to the system preference (light) when matchMedia does not match dark', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))

    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    vi.unstubAllGlobals()
  })

  it('should throw when useTheme is used outside a ThemeProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Consumer />)).toThrow('useTheme deve ser usado dentro de um ThemeProvider')
    consoleError.mockRestore()
  })
})
