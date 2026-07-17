import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithUser } from '../../test-utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu'

function renderMenu() {
  return renderWithUser(
    <DropdownMenu>
      <DropdownMenuTrigger>Abrir menu</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Perfil</DropdownMenuItem>
        <DropdownMenuItem>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>,
  )
}

describe('DropdownMenu', () => {
  it('should not render menu items until the trigger is activated', () => {
    renderMenu()
    expect(screen.queryByText('Perfil')).not.toBeInTheDocument()
  })

  it('should render menu items after clicking the trigger', async () => {
    const { user } = renderMenu()
    await user.click(screen.getByRole('button', { name: 'Abrir menu' }))
    expect(await screen.findByText('Perfil')).toBeInTheDocument()
    expect(screen.getByText('Sair')).toBeInTheDocument()
    expect(screen.getByText('Minha conta')).toBeInTheDocument()
  })

  it('should call onSelect when a menu item is clicked', async () => {
    const { user } = renderWithUser(
      <DropdownMenu>
        <DropdownMenuTrigger>Abrir menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => (document.title = 'selected')}>Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    await user.click(screen.getByRole('button', { name: 'Abrir menu' }))
    await user.click(await screen.findByText('Sair'))
    expect(document.title).toBe('selected')
  })
})
