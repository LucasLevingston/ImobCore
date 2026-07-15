'use client'

import Link from 'next/link'
import { LogoutButton } from '../../features/auth/logout'
import { useProfile } from '../../features/auth/profile'
import { useAuthStore } from '../../stores/auth-store'

// Exposto via Module Federation — ações de sessão (perfil/logout ou entrar/criar conta)
export function UserMenu() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const { data } = useProfile()

  if (!accessToken || !data) {
    return (
      <nav className="flex items-center gap-4">
        <Link href="/login" className="text-sm font-medium underline-offset-4 hover:underline">
          Entrar
        </Link>
        <Link href="/register" className="text-sm font-medium underline-offset-4 hover:underline">
          Criar conta
        </Link>
      </nav>
    )
  }

  return (
    <nav className="flex items-center gap-4">
      <Link href="/profile" className="text-sm font-medium underline-offset-4 hover:underline">
        Meu perfil
      </Link>
      <LogoutButton />
    </nav>
  )
}
