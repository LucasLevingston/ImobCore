import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { Toaster } from '@microfrontends/ui'
import { renderWithUser } from '../test-utils/renderWithUser'
import { NotificationsButton } from './NotificationsButton'

describe('NotificationsButton', () => {
  it('should render a button with an accessible label', () => {
    renderWithUser(<NotificationsButton />)
    expect(screen.getByRole('button', { name: 'Notificações' })).toBeInTheDocument()
  })

  it('should show a placeholder toast when clicked', async () => {
    const { user } = renderWithUser(
      <>
        <NotificationsButton />
        <Toaster />
      </>,
    )
    await user.click(screen.getByRole('button', { name: 'Notificações' }))

    expect(await screen.findByText('Nenhuma notificação nova')).toBeInTheDocument()
  })
})
