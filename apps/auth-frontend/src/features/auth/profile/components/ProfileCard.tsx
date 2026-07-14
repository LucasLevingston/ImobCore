'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ErrorState,
  Loading,
} from '@microfrontends/ui'
import { useProfile } from '../hooks/useProfile'

export function ProfileCard() {
  const { data, isLoading, isError, refetch } = useProfile()

  if (isLoading) {
    return <Loading label="Carregando perfil..." />
  }

  if (isError || !data) {
    return (
      <ErrorState title="Não foi possível carregar seu perfil" onRetry={() => void refetch()} />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.name}</CardTitle>
        <CardDescription>{data.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Membro desde {new Date(data.createdAt).toLocaleDateString('pt-BR')}
        </p>
      </CardContent>
    </Card>
  )
}
