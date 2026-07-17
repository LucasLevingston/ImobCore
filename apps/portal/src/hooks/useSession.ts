import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { sessionService } from '../services/session.service'
import type { SessionUser } from '../services/session.service.types'
import { SESSION_QUERY_KEY } from './useSession.constants'

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
