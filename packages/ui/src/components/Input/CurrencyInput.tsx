import * as React from 'react'
import { Input, type InputProps } from './Input'

// SRP: só resolve o formato "moeda" — nunca uma prop `type: 'currency' | 'text'`
// ramificando comportamento dentro de Input (violaria OCP). Estado do
// formulário permanece number puro; só a exibição é formatada.
export interface CurrencyInputProps extends Omit<InputProps, 'onChange' | 'value' | 'type'> {
  value: number | undefined
  onChange: (value: number | undefined) => void
  currency?: string
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, currency = 'BRL', ...props }, ref) => {
    const formatter = React.useMemo(
      () => new Intl.NumberFormat('pt-BR', { style: 'currency', currency }),
      [currency],
    )

    const displayValue = value === undefined ? '' : formatter.format(value)

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      const digitsOnly = event.target.value.replace(/\D/g, '')
      onChange(digitsOnly ? Number(digitsOnly) / 100 : undefined)
    }

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        {...props}
      />
    )
  },
)
CurrencyInput.displayName = 'CurrencyInput'
