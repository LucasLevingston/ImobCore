import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteProperty } from '../services/delete-property.service'

export function useDeleteProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })
}
