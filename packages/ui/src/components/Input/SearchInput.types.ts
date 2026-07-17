import type { InputProps } from './Input.types'

export interface SearchInputProps extends Omit<InputProps, 'type'> {
  onClear?: () => void
}
