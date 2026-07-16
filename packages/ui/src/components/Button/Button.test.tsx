import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { renderWithUser } from '../../test-utils'
import { Button } from './Button'

// Ícone de exemplo minimalista — evita depender de lucide-react só pra testar
// o padrão de composição ícone+texto (que não é específico de nenhum ícone).
function PlusIcon() {
  return (
    <svg data-testid="plus-icon" aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

describe('Button', () => {
  it('should render children content', () => {
    render(<Button>Salvar</Button>)
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    const onClick = vi.fn()
    const { user } = renderWithUser(<Button onClick={onClick}>Salvar</Button>)

    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('should not call onClick when disabled', async () => {
    const onClick = vi.fn()
    const { user } = renderWithUser(
      <Button onClick={onClick} disabled>
        Salvar
      </Button>,
    )

    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onClick).not.toHaveBeenCalled()
  })

  it('should be disabled while loading and show loading state', () => {
    render(<Button isLoading>Salvar</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('should apply the destructive variant class', () => {
    render(<Button variant="destructive">Excluir</Button>)
    expect(screen.getByRole('button', { name: 'Excluir' })).toHaveClass('bg-destructive')
  })

  it('should apply the outline variant class', () => {
    render(<Button variant="outline">Cancelar</Button>)
    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveClass('border')
  })

  it('should render as a child element when asChild is used', () => {
    render(
      <Button asChild>
        <a href="/home">Ir para home</a>
      </Button>,
    )

    const link = screen.getByRole('link', { name: 'Ir para home' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/home')
  })

  it('should forward custom className alongside variant classes', () => {
    render(<Button className="my-custom-class">Salvar</Button>)
    expect(screen.getByRole('button', { name: 'Salvar' })).toHaveClass('my-custom-class')
  })

  it('should render icon and text together with the correct spacing class', () => {
    render(
      <Button>
        <PlusIcon />
        Novo imóvel
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Novo imóvel' })
    expect(button).toHaveClass('gap-2')
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
  })

  it('should require an accessible name via aria-label for icon-only buttons', () => {
    render(
      <Button size="icon" aria-label="Excluir imóvel">
        <PlusIcon />
      </Button>,
    )

    expect(screen.getByRole('button', { name: 'Excluir imóvel' })).toBeInTheDocument()
  })

  it('should have no accessible name when an icon-only button omits aria-label', () => {
    render(
      <Button size="icon">
        <PlusIcon />
      </Button>,
    )

    expect(screen.queryByRole('button', { name: 'Excluir imóvel' })).not.toBeInTheDocument()
    expect(screen.getByRole('button')).not.toHaveAccessibleName()
  })
})
