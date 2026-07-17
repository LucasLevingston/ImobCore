import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithUser } from '../../test-utils'
import { Input } from './Input'

describe('Input', () => {
  it('should render with placeholder', () => {
    render(<Input placeholder="Digite seu email" />)
    expect(screen.getByPlaceholderText('Digite seu email')).toBeInTheDocument()
  })

  it('should call onChange as the user types', async () => {
    const onChange = vi.fn()
    const { user } = renderWithUser(<Input onChange={onChange} aria-label="email" />)

    await user.type(screen.getByLabelText('email'), 'a')

    expect(onChange).toHaveBeenCalled()
  })

  it('should reflect typed value', async () => {
    const { user } = renderWithUser(<Input aria-label="email" />)

    const input = screen.getByLabelText('email')
    await user.type(input, 'lucas@email.com')

    expect(input).toHaveValue('lucas@email.com')
  })

  it('should be disabled when disabled prop is set', () => {
    render(<Input disabled aria-label="email" />)
    expect(screen.getByLabelText('email')).toBeDisabled()
  })

  it('should render an error message when error prop is provided', () => {
    render(<Input aria-label="email" error="Email inválido" />)
    expect(screen.getByText('Email inválido')).toBeInTheDocument()
  })

  it('should mark input as invalid via aria-invalid when error is present', () => {
    render(<Input aria-label="email" error="Email inválido" />)
    expect(screen.getByLabelText('email')).toHaveAttribute('aria-invalid', 'true')
  })

  it('should not render error message or aria-invalid when there is no error', () => {
    render(<Input aria-label="email" />)
    expect(screen.getByLabelText('email')).toHaveAttribute('aria-invalid', 'false')
  })

  it('should respect the type attribute', () => {
    render(<Input type="password" aria-label="senha" />)
    expect(screen.getByLabelText('senha')).toHaveAttribute('type', 'password')
  })
})
