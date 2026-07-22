'use client'

import { useAuthSession } from '../../features/auth/profile'

// Exposto via Module Federation — dono do estado vivo de sessão (docs seção 06/07).
// properties-frontend consome pra saber "quem está logado" sem reimplementar auth.
export function AuthStatus() {
  const { isAuthenticated, user } = useAuthSession()

  if (!isAuthenticated || !user) {
    return null
  }

  return <span className="text-sm font-medium">{user.name}</span>
}
