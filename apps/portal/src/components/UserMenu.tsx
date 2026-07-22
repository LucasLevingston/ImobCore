'use client'

import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@microfrontends/ui'
import { LogOut, User as UserIcon } from 'lucide-react'
import { useSessionContext } from '../contexts/useSessionContext'
import { useLogout } from '../hooks/useLogout'

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function UserMenu() {
  const { user, isLoading } = useSessionContext()
  const { mutate: logout } = useLogout()

  if (isLoading || !user) {
    return null
  }

  // mutate (não await direto): useLogout já limpa store/queryClient em
  // onSettled mesmo se a chamada ao servidor falhar — sem isso, uma falha de
  // rede aqui virava uma promise rejeitada sem tratamento (usuário "preso")
  function handleLogout() {
    logout(undefined, { onSettled: () => window.location.reload() })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{initials(user.name)}</AvatarFallback>
        </Avatar>
        <span className="sr-only">{user.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>{user.name}</span>
            <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserIcon className="mr-2 h-4 w-4" aria-hidden="true" />
          Perfil
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
