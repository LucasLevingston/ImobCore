import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithUser } from '../../test-utils'
import { ErrorState } from './Error'

describe('ErrorState', () => {
  it('should render default title and message', () => {
    render(<ErrorState />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Algo deu errado')).toBeInTheDocument()
    expect(screen.getByText('Tente novamente em instantes.')).toBeInTheDocument()
  })

  it('should render custom title and message', () => {
    render(<ErrorState title="Falha ao carregar" message="Não foi possível buscar os produtos." />)
    expect(screen.getByText('Falha ao carregar')).toBeInTheDocument()
    expect(screen.getByText('Não foi possível buscar os produtos.')).toBeInTheDocument()
  })

  it('should not render a retry button when onRetry is not provided', () => {
    render(<ErrorState />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should render a retry button and call onRetry when clicked', async () => {
    const onRetry = vi.fn()
    const { user } = renderWithUser(<ErrorState onRetry={onRetry} />)

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
