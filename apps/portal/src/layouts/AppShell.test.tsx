import { ThemeProvider } from '@microfrontends/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SessionContext } from '../contexts/SessionContext'
import type { SessionContextValue } from '../contexts/SessionContext.types'
import { AppShell } from './AppShell'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

const authenticatedValue: SessionContextValue = {
  user: { id: 'user-1', name: 'Lucas Levingston', email: 'lucas@email.com', createdAt: '' },
  isAuthenticated: true,
  isLoading: false,
}

function renderShell() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SessionContext.Provider value={authenticatedValue}>
          <AppShell>
            <p>conteúdo da página</p>
          </AppShell>
        </SessionContext.Provider>
      </ThemeProvider>
    </QueryClientProvider>,
  )
}

describe('AppShell', () => {
  it('should render the header, sidebar, breadcrumb, content and footer', () => {
    renderShell()

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Navegação lateral' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument()
    expect(screen.getByText('conteúdo da página')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('should toggle the sidebar collapsed state when the collapse button is clicked', async () => {
    const user = userEvent.setup()
    renderShell()

    const dashboardLabelBefore = screen.getByText('Dashboard')
    expect(dashboardLabelBefore).not.toHaveClass('sr-only')

    await user.click(screen.getByRole('button', { name: 'Recolher menu' }))

    const dashboardLabelAfter = screen.getByText('Dashboard')
    expect(dashboardLabelAfter).toHaveClass('sr-only')
  })
})
