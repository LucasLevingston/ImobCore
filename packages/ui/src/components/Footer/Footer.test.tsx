import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

describe('Footer', () => {
  it('should render a contentinfo landmark for accessibility', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('should render the left slot content', () => {
    render(<Footer left={<span>Minha Plataforma</span>} />)
    expect(screen.getByText('Minha Plataforma')).toBeInTheDocument()
  })

  it('should render the right slot content', () => {
    render(<Footer right={<span>v0.1.0</span>} />)
    expect(screen.getByText('v0.1.0')).toBeInTheDocument()
  })

  it('should render children when provided instead of slots', () => {
    render(
      <Footer>
        <span>Conteúdo customizado</span>
      </Footer>,
    )
    expect(screen.getByText('Conteúdo customizado')).toBeInTheDocument()
  })

  it('should render left and right slots together without one overriding another', () => {
    render(<Footer left={<span>Esquerda</span>} right={<span>Direita</span>} />)
    expect(screen.getByText('Esquerda')).toBeInTheDocument()
    expect(screen.getByText('Direita')).toBeInTheDocument()
  })

  it('should forward custom className', () => {
    render(<Footer className="my-footer" />)
    expect(screen.getByRole('contentinfo')).toHaveClass('my-footer')
  })
})
