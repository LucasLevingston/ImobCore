import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from './Header'

describe('Header', () => {
  it('should render a banner landmark for accessibility', () => {
    render(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('should render the logo slot content', () => {
    render(<Header logo={<span>Minha Plataforma</span>} />)
    expect(screen.getByText('Minha Plataforma')).toBeInTheDocument()
  })

  it('should render nav slot content', () => {
    render(<Header nav={<nav aria-label="principal">Menu</nav>} />)
    expect(screen.getByRole('navigation', { name: 'principal' })).toBeInTheDocument()
  })

  it('should render actions slot content (ex.: AuthStatus federado)', () => {
    render(<Header actions={<button type="button">Sair</button>} />)
    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument()
  })

  it('should render all slots together without one overriding another', () => {
    render(
      <Header
        logo={<span>Logo</span>}
        nav={<nav aria-label="principal">Nav</nav>}
        actions={<span>Ações</span>}
      />,
    )

    expect(screen.getByText('Logo')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'principal' })).toBeInTheDocument()
    expect(screen.getByText('Ações')).toBeInTheDocument()
  })

  it('should forward custom className', () => {
    render(<Header className="my-header" />)
    expect(screen.getByRole('banner')).toHaveClass('my-header')
  })
})
