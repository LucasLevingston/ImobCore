import * as React from 'react'
import type { SessionUser } from '../services/session.service'

export interface SessionContextValue {
  user: SessionUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

// DIP: componentes consomem esta abstração (user/isAuthenticated/isLoading),
// nunca useSession()/TanStack Query diretamente — troca de estratégia de
// busca de sessão não deveria vazar pra UserMenu, PortalHeader etc.
export const SessionContext = React.createContext<SessionContextValue | undefined>(undefined)

export function useSessionContext(): SessionContextValue {
  const context = React.useContext(SessionContext)
  if (!context) {
    throw new Error('useSessionContext deve ser usado dentro de um SessionProvider')
  }
  return context
}
