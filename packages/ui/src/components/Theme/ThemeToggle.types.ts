import type { ButtonProps } from '../Button'

export type ThemeToggleProps = Omit<ButtonProps, 'onClick' | 'children' | 'aria-label'>
