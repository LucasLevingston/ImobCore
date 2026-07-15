import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PlaceholderModule } from './PlaceholderModule'

describe('PlaceholderModule', () => {
  it('should render the given title', () => {
    render(<PlaceholderModule title="Clientes" />)
    expect(screen.getByRole('heading', { name: 'Clientes' })).toBeInTheDocument()
  })

  it('should render a default description when none is given', () => {
    render(<PlaceholderModule title="Clientes" />)
    expect(screen.getByText('Este módulo ainda está em construção.')).toBeInTheDocument()
  })

  it('should render a custom description when given', () => {
    render(<PlaceholderModule title="Clientes" description="Chega na próxima fase." />)
    expect(screen.getByText('Chega na próxima fase.')).toBeInTheDocument()
  })
})
