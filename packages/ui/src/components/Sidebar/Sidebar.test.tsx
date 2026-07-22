import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithUser } from '../../test-utils'
import { Sidebar } from './Sidebar'
import type { SidebarItem } from './Sidebar.types'

const items: SidebarItem[] = [
  { label: 'Produtos', href: '/products' },
  { label: 'Perfil', href: '/profile', active: true },
]

describe('Sidebar', () => {
  it('should render a navigation landmark', () => {
    render(<Sidebar items={items} />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('should render a link for each item', () => {
    render(<Sidebar items={items} />)
    expect(screen.getByRole('link', { name: 'Produtos' })).toHaveAttribute('href', '/products')
    expect(screen.getByRole('link', { name: 'Perfil' })).toHaveAttribute('href', '/profile')
  })

  it('should mark the active item with aria-current', () => {
    render(<Sidebar items={items} />)
    expect(screen.getByRole('link', { name: 'Perfil' })).toHaveAttribute('aria-current', 'page')
  })

  it('should not set aria-current on inactive items', () => {
    render(<Sidebar items={items} />)
    expect(screen.getByRole('link', { name: 'Produtos' })).not.toHaveAttribute('aria-current')
  })

  it('should render an icon when provided', () => {
    render(
      <Sidebar
        items={[
          { label: 'Produtos', href: '/products', icon: <span data-testid="icon-produtos" /> },
        ]}
      />,
    )
    expect(screen.getByTestId('icon-produtos')).toBeInTheDocument()
  })

  it('should render header and footer slots', () => {
    render(
      <Sidebar items={items} header={<span>Minha Plataforma</span>} footer={<span>v0.1.0</span>} />,
    )
    expect(screen.getByText('Minha Plataforma')).toBeInTheDocument()
    expect(screen.getByText('v0.1.0')).toBeInTheDocument()
  })

  it('should render empty state when there are no items', () => {
    render(<Sidebar items={[]} />)
    expect(screen.getByText('Nenhum item de navegação.')).toBeInTheDocument()
  })

  it('should keep labels visible by default (not collapsed)', () => {
    render(<Sidebar items={items} />)
    expect(screen.getByText('Produtos')).not.toHaveClass('sr-only')
  })

  it('should visually hide labels when collapsed, while keeping them accessible', () => {
    render(<Sidebar items={items} collapsed />)
    expect(screen.getByText('Produtos')).toHaveClass('sr-only')
    // sr-only não remove do nome acessível — o link continua navegável por leitor de tela
    expect(screen.getByRole('link', { name: 'Produtos' })).toHaveAttribute('href', '/products')
  })

  it('should show the item label in a tooltip on hover when collapsed', async () => {
    const { user } = renderWithUser(<Sidebar items={items} collapsed />)

    await user.hover(screen.getByRole('link', { name: 'Produtos' }))

    expect(await screen.findByText('Produtos', { selector: 'div' })).toBeInTheDocument()
  })

  it('should not wrap items in a tooltip when not collapsed', () => {
    render(<Sidebar items={items} />)
    expect(screen.queryByText('Produtos', { selector: 'div' })).not.toBeInTheDocument()
  })
})
