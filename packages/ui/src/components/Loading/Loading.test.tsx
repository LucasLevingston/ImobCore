import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Loading } from './Loading'

describe('Loading', () => {
  it('should render a status role for accessibility', () => {
    render(<Loading />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should render default accessible label', () => {
    render(<Loading />)
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('should render custom label when provided', () => {
    render(<Loading label="Buscando produtos..." />)
    expect(screen.getByText('Buscando produtos...')).toBeInTheDocument()
  })

  it('should apply size classes based on the size prop', () => {
    render(<Loading size="lg" />)
    expect(screen.getByRole('status').firstChild).toHaveClass('h-8', 'w-8')
  })

  it('should default to medium size', () => {
    render(<Loading />)
    expect(screen.getByRole('status').firstChild).toHaveClass('h-5', 'w-5')
  })
})
