import type * as React from 'react'

// ISP: 3 slots opcionais — logo, nav, actions. Sem estado de auth aqui;
// quem injeta AuthStatus/UserMenu (via Module Federation) é o app consumidor.
export interface HeaderProps {
  logo?: React.ReactNode
  nav?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}
