import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { sessionService, type SessionUser } from '../services/session.service'

export const SESSION_QUERY_KEY = ['session'] as const

// staleTime alto: identidade do usuário logado raramente muda durante a
// sessão — evita refetch a cada navegação entre módulos do Portal
export function useSession(): UseQueryResult<SessionUser> {
  return useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: sessionService.getMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}
