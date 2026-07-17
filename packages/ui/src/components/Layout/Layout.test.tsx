import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Layout } from './Layout'

describe('Layout', () => {
  it('should render children content', () => {
    render(<Layout>conteúdo da página</Layout>)
    expect(screen.getByText('conteúdo da página')).toBeInTheDocument()
  })

  it('should render inside a main landmark for accessibility', () => {
    render(<Layout>conteúdo</Layout>)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('should constrain content width by default', () => {
    render(<Layout>conteúdo</Layout>)
    expect(screen.getByRole('main')).toHaveClass('max-w-7xl')
  })

  it('should allow full width via the fullWidth prop', () => {
    render(<Layout fullWidth>conteúdo</Layout>)
    expect(screen.getByRole('main')).not.toHaveClass('max-w-7xl')
  })

  it('should forward custom className', () => {
    render(<Layout className="my-layout">conteúdo</Layout>)
    expect(screen.getByRole('main')).toHaveClass('my-layout')
  })
})
