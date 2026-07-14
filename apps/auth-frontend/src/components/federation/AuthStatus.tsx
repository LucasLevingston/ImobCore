'use client'

import { useProfile } from '../../features/auth/profile'
import { useAuthStore } from '../../stores/auth-store'

// Exposto via Module Federation — dono do estado vivo de sessão (docs seção 06/07).
// properties-frontend consome pra saber "quem está logado" sem reimplementar auth.
export function AuthStatus() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const { data } = useProfile()

  if (!accessToken || !data) {
    return null
  }

  return <span className="text-sm font-medium">{data.name}</span>
}
