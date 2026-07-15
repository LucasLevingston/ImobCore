import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { PropertyFormValues } from '../../create/schemas/property-form.schema'
import { updateProperty } from '../services/update-property.service'

export function useUpdateProperty(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: PropertyFormValues) => updateProperty(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['properties'] })
      void queryClient.invalidateQueries({ queryKey: ['property', id] })
    },
  })
}
