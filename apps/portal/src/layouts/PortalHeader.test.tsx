import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@microfrontends/ui'
import { SessionContext } from '../contexts/SessionContext'
import type { SessionContextValue } from '../contexts/SessionContext.types'
import { PortalHeader } from './PortalHeader'

const authenticatedValue: SessionContextValue = {
  user: { id: 'user-1', name: 'Lucas Levingston', email: 'lucas@email.com', createdAt: '' },
  isAuthenticated: true,
  isLoading: false,
}

function renderHeader(value: SessionContextValue = authenticatedValue) {
  return render(
    <ThemeProvider>
      <SessionContext.Provider value={value}>
        <PortalHeader />
      </SessionContext.Provider>
    </ThemeProvider>,
  )
}

describe('PortalHeader', () => {
  it('should render a banner landmark with the platform name', () => {
    renderHeader()
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByText('Microfrontends Platform')).toBeInTheDocument()
  })

  it('should render the global search input', () => {
    renderHeader()
    expect(screen.getByRole('searchbox', { name: 'Pesquisar' })).toBeInTheDocument()
  })

  it('should render the theme toggle', () => {
    renderHeader()
    expect(screen.getByRole('button', { name: 'Alternar tema' })).toBeInTheDocument()
  })

  it('should render the notifications button', () => {
    renderHeader()
    expect(screen.getByRole('button', { name: 'Notificações' })).toBeInTheDocument()
  })

  it('should render the user menu avatar when authenticated', () => {
    renderHeader()
    expect(screen.getByText('LL')).toBeInTheDocument()
  })
})
