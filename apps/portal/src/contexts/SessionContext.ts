'use client'

import * as React from 'react'
import type { SessionContextValue } from './SessionContext.types'

// DIP: componentes consomem esta abstração (user/isAuthenticated/isLoading),
// nunca useSession()/TanStack Query diretamente — troca de estratégia de
// busca de sessão não deveria vazar pra UserMenu, PortalHeader etc.
// 'use client': createContext em módulo sem essa diretiva quebra o build se
// algum Server Component importar este arquivo (mesmo caso do Theme em
// @microfrontends/ui — ver ARCHITECTURE.md).
export const SessionContext = React.createContext<SessionContextValue | undefined>(undefined)
