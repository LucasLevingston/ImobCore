'use client'

import {
  Avatar,
  AvatarFallback,
  Card,
  CardContent,
  CardHeader,
  ErrorState,
  Skeleton,
} from '@microfrontends/ui'
import { useProfile } from '../hooks/useProfile'

function getInitials(name: string): string {
  const [first, second] = name.trim().split(/\s+/)
  return `${first?.[0]}${second?.[0] ?? ''}`.toUpperCase()
}

export function ProfileCard() {
  const { data, isLoading, isError, refetch } = useProfile()

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex-row items-center gap-4 space-y-0">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-48" />
        </CardContent>
      </Card>
    )
  }

  if (isError || !data) {
    return (
      <ErrorState title="Não foi possível carregar seu perfil" onRetry={() => void refetch()} />
    )
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-4 space-y-0">
        <Avatar className="h-14 w-14">
          <AvatarFallback className="text-base">{getInitials(data.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold leading-none tracking-tight">{data.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{data.email}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Membro desde {new Date(data.createdAt).toLocaleDateString('pt-BR')}
        </p>
      </CardContent>
    </Card>
  )
}
