'use client'

import type { ReactNode } from 'react'
import { SessionContext } from '../contexts/SessionContext'
import { useSession } from '../hooks/useSession'

export function SessionProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, isSuccess } = useSession()

  return (
    <SessionContext.Provider
      value={{
        user: data ?? null,
        isAuthenticated: isSuccess && Boolean(data),
        isLoading,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}
