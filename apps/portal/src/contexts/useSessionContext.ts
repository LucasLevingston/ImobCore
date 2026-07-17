import * as React from 'react'
import { SessionContext } from './SessionContext'
import type { SessionContextValue } from './SessionContext.types'

export function useSessionContext(): SessionContextValue {
  const context = React.useContext(SessionContext)
  if (!context) {
    throw new Error('useSessionContext deve ser usado dentro de um SessionProvider')
  }
  return context
}
