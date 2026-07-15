import { useMutation } from '@tanstack/react-query'
import { registerService } from '../services/register.service'

export function useRegister() {
  return useMutation({
    mutationFn: registerService.register,
  })
}
