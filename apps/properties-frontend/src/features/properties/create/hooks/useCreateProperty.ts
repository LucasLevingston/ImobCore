import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProperty } from '../services/create-property.service'

export function useCreateProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })
}
