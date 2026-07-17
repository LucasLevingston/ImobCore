import type * as React from 'react'
import type { VariantProps } from 'class-variance-authority'
import type { buttonVariants } from './Button.variants'

// ISP: interface mínima — extensão de comportamento via asChild (OCP), não props booleanas extras
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: React.ReactNode
}
