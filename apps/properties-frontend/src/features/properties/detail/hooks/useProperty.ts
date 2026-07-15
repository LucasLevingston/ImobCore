import { useQuery } from '@tanstack/react-query'
import { getProperty } from '../services/get-property.service'

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => getProperty(id),
  })
}
