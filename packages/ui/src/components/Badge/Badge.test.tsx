import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
  it('should render children content', () => {
    render(<Badge>Disponível</Badge>)
    expect(screen.getByText('Disponível')).toBeInTheDocument()
  })

  it('should apply the default variant class', () => {
    render(<Badge>Disponível</Badge>)
    expect(screen.getByText('Disponível')).toHaveClass('bg-primary')
  })

  it('should apply the success variant class', () => {
    render(<Badge variant="success">Disponível</Badge>)
    expect(screen.getByText('Disponível')).toHaveClass('text-success')
  })

  it('should apply the warning variant class', () => {
    render(<Badge variant="warning">Reservado</Badge>)
    expect(screen.getByText('Reservado')).toHaveClass('text-warning')
  })

  it('should apply the destructive variant class', () => {
    render(<Badge variant="destructive">Inativo</Badge>)
    expect(screen.getByText('Inativo')).toHaveClass('text-destructive')
  })

  it('should apply the outline variant class', () => {
    render(<Badge variant="outline">Vendido</Badge>)
    expect(screen.getByText('Vendido')).toHaveClass('border-border')
  })

  it('should forward custom className alongside variant classes', () => {
    render(<Badge className="my-custom-class">Disponível</Badge>)
    expect(screen.getByText('Disponível')).toHaveClass('my-custom-class')
  })
})
