import { useTheme } from '@microfrontends/ui'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useSessionContext } from '../contexts/useSessionContext'
import { MOCK_USER } from '../mocks/handlers/auth'
import { AppProviders } from './AppProviders'

function Consumer() {
  const { user } = useSessionContext()
  const { theme } = useTheme()
  return (
    <div>
      <span data-testid="user">{user?.name ?? 'carregando'}</span>
      <span data-testid="theme">{theme}</span>
    </div>
  )
}

describe('AppProviders', () => {
  it('should provide QueryClient, Theme and Session context to descendants', async () => {
    render(
      <AppProviders>
        <Consumer />
      </AppProviders>,
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent(MOCK_USER.name))
  })

  it('should render its children', () => {
    render(
      <AppProviders>
        <span>conteúdo filho</span>
      </AppProviders>,
    )
    expect(screen.getByText('conteúdo filho')).toBeInTheDocument()
  })
})
