import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useAuthStore } from '../../../../stores/auth-store'
import { profileService } from '../services/profile.service'
import { PROFILE_QUERY_KEY } from './useProfile.constants'

export function useProfile() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const setUser = useAuthStore((state) => state.setUser)

  const query = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: profileService.getMe,
    enabled: !!accessToken,
  })

  // Sincroniza dado já buscado pra store (não é fetch em useEffect — o fetch
  // continua 100% no TanStack Query; isso só espelha o resultado)
  useEffect(() => {
    if (query.data) {
      setUser(query.data)
    }
  }, [query.data, setUser])

  return query
}
