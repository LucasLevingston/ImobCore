import * as React from 'react'
import { Input } from './Input'
import type { CurrencyInputProps } from './CurrencyInput.types'

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
