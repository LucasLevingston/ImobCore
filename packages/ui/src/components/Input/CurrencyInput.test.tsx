import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CurrencyInput } from './CurrencyInput'

const brlFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

describe('CurrencyInput', () => {
  it('should render empty when value is undefined', () => {
    render(<CurrencyInput value={undefined} onChange={vi.fn()} />)
    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('should format the value as BRL currency for display', () => {
    render(<CurrencyInput value={1234.56} onChange={vi.fn()} />)
    expect(screen.getByRole('textbox')).toHaveValue(brlFormatter.format(1234.56))
  })

  it('should call onChange with a numeric value, not a formatted string', () => {
    const onChange = vi.fn()
    render(<CurrencyInput value={undefined} onChange={onChange} />)

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '123456' } })

    expect(onChange).toHaveBeenCalledWith(1234.56)
  })

  it('should call onChange with undefined when the field is cleared', () => {
    const onChange = vi.fn()
    render(<CurrencyInput value={10} onChange={onChange} />)

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } })

    expect(onChange).toHaveBeenCalledWith(undefined)
  })

  it('should ignore non-digit characters when parsing typed input', () => {
    const onChange = vi.fn()
    render(<CurrencyInput value={undefined} onChange={onChange} />)

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'R$ 1a2b3' } })

    expect(onChange).toHaveBeenCalledWith(1.23)
  })

  it('should display the error message when error prop is provided', () => {
    render(<CurrencyInput value={undefined} onChange={vi.fn()} error="Preço é obrigatório" />)
    expect(screen.getByText('Preço é obrigatório')).toBeInTheDocument()
  })

  it('should format using a different currency when provided', () => {
    const usdFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD' })
    render(<CurrencyInput value={10} onChange={vi.fn()} currency="USD" />)
    expect(screen.getByRole('textbox')).toHaveValue(usdFormatter.format(10))
  })
})
