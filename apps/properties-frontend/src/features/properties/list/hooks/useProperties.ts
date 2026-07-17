import { useQuery } from '@tanstack/react-query'
import { listProperties } from '../services/list-properties.service'
import type { ListPropertiesParams } from '../services/list-properties.service.types'

export function useProperties(params: ListPropertiesParams) {
  return useQuery({
    queryKey: ['properties', params],
    queryFn: () => listProperties(params),
  })
}
