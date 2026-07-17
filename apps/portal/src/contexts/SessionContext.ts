import * as React from 'react'
import type { SessionContextValue } from './SessionContext.types'

// DIP: componentes consomem esta abstração (user/isAuthenticated/isLoading),
// nunca useSession()/TanStack Query diretamente — troca de estratégia de
// busca de sessão não deveria vazar pra UserMenu, PortalHeader etc.
export const SessionContext = React.createContext<SessionContextValue | undefined>(undefined)
