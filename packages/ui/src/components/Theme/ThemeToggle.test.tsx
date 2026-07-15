import { describe, expect, it, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithUser } from '../../test-utils'
import { ThemeProvider } from './ThemeProvider'
import { ThemeToggle } from './ThemeToggle'

function renderToggle() {
  return renderWithUser(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  )
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('should render a button with an accessible label', () => {
    renderToggle()
    expect(screen.getByRole('button', { name: 'Alternar tema' })).toBeInTheDocument()
  })

  it('should toggle the theme when clicked', async () => {
    const { user } = renderToggle()
    const button = screen.getByRole('button', { name: 'Alternar tema' })
    await user.click(button)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    await user.click(button)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
