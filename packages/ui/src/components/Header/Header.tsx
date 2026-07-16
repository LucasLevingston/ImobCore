import * as React from 'react'
import { cn } from '../../lib/utils'

// ISP: 3 slots opcionais — logo, nav, actions. Sem estado de auth aqui;
// quem injeta AuthStatus/UserMenu (via Module Federation) é o app consumidor.
export interface HeaderProps {
  logo?: React.ReactNode
  nav?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function Header({ logo, nav, actions, className }: HeaderProps) {
  return (
    <header
      className={cn(
        'flex h-16 w-full items-center justify-between gap-4 border-b bg-background px-4 md:px-8',
        className,
      )}
    >
      <div className="flex items-center gap-6">
        {logo}
        {nav}
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </header>
  )
}
