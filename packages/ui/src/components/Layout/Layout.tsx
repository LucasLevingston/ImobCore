import * as React from 'react'
import { cn } from '../../lib/utils'

export interface LayoutProps {
  children: React.ReactNode
  fullWidth?: boolean
  className?: string
}

export function Layout({ children, fullWidth = false, className }: LayoutProps) {
  return (
    <main className={cn('mx-auto w-full px-4 py-6 md:px-8', !fullWidth && 'max-w-7xl', className)}>
      {children}
    </main>
  )
}
