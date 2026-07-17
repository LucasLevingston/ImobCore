import type { InputProps } from './Input.types'

// SRP: só resolve o formato "moeda" — nunca uma prop `type: 'currency' | 'text'`
// ramificando comportamento dentro de Input (violaria OCP). Estado do
// formulário permanece number puro; só a exibição é formatada.
export interface CurrencyInputProps extends Omit<InputProps, 'onChange' | 'value' | 'type'> {
  value: number | undefined
  onChange: (value: number | undefined) => void
  currency?: string
}
