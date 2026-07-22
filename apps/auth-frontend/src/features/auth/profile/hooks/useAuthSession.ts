import { useAuthStore } from '../../../../stores/auth-store'
import type { ProfileResponse } from '../services/profile.service.types'
import { useProfile } from './useProfile'

interface AuthSession {
  isAuthenticated: boolean
  user: ProfileResponse | undefined
}

// Única definição de "autenticado" (token em memória + perfil carregado) —
// antes duplicada em AuthStatus e UserMenu, cada um recalculando por conta
// própria (docs seção 06/07: componentes de federação dependem deste hook,
// não do critério inline).
export function useAuthSession(): AuthSession {
  const accessToken = useAuthStore((state) => state.accessToken)
  const { data } = useProfile()

  return { isAuthenticated: Boolean(accessToken && data), user: data }
}
