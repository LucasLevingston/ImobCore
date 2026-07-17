import { render, screen } from '@testing-library/react'
import type { FormEvent } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithUser } from '../../test-utils'
import { SubmitButton } from './SubmitButton'

describe('SubmitButton', () => {
  it('should always render as type="submit"', () => {
    render(<SubmitButton>Salvar</SubmitButton>)
    expect(screen.getByRole('button', { name: 'Salvar' })).toHaveAttribute('type', 'submit')
  })

  it('should be disabled and show the default loading text when isLoading is true', () => {
    render(<SubmitButton isLoading>Salvar</SubmitButton>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('should show custom loadingText when provided', () => {
    render(
      <SubmitButton isLoading loadingText="Criando imóvel...">
        Criar imóvel
      </SubmitButton>,
    )

    expect(screen.getByText('Criando imóvel...')).toBeInTheDocument()
    expect(screen.queryByText('Criar imóvel')).not.toBeInTheDocument()
  })

  it('should forward onClick/variant/size props to the underlying Button', () => {
    const onClick = vi.fn()
    render(
      <SubmitButton onClick={onClick} variant="destructive" size="sm">
        Excluir
      </SubmitButton>,
    )

    const button = screen.getByRole('button', { name: 'Excluir' })
    expect(button).toHaveClass('bg-destructive')
  })

  it('should not trigger a second submit while isLoading disables the button', async () => {
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault())
    function Form({ isLoading }: { isLoading: boolean }) {
      return (
        <form onSubmit={onSubmit}>
          <SubmitButton isLoading={isLoading}>Salvar</SubmitButton>
        </form>
      )
    }

    const { user, rerender } = renderWithUser(<Form isLoading={false} />)
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(onSubmit).toHaveBeenCalledTimes(1)

    rerender(<Form isLoading />)
    await user.click(screen.getByRole('button'))
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })
})
