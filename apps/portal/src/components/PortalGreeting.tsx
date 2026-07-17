'use client'

import { Loading } from '@microfrontends/ui'
import { useSessionContext } from '../contexts/useSessionContext'
import { firstName } from '../utils/first-name'

export function PortalGreeting() {
  const { user, isLoading } = useSessionContext()

  if (isLoading) {
    return <Loading label="Carregando sua sessão..." />
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {user ? `Bem-vindo(a), ${firstName(user.name)}` : 'Bem-vindo(a)'}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">Acesse os módulos da plataforma abaixo.</p>
    </div>
  )
}
