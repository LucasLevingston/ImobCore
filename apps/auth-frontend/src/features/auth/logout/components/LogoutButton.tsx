'use client'

import { Button } from '@microfrontends/ui'
import { useLogout } from '../hooks/useLogout'
import type { LogoutButtonProps } from './LogoutButton.types'

export function LogoutButton({ onLoggedOut = () => {} }: LogoutButtonProps) {
  const { mutate, isPending } = useLogout()

  return (
    <Button
      variant="ghost"
      isLoading={isPending}
      onClick={() => mutate(undefined, { onSettled: onLoggedOut })}
    >
      Sair
    </Button>
  )
}
