import { useQuery } from '@tanstack/react-query'
import { listProperties, type ListPropertiesParams } from '../services/list-properties.service'

export function useProperties(params: ListPropertiesParams) {
  return useQuery({
    queryKey: ['properties', params],
    queryFn: () => listProperties(params),
  })
}
