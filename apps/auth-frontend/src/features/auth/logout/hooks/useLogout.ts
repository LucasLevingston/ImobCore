import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../../../../stores/auth-store'
import { logoutService } from '../services/logout.service'

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logoutService.logout,
    // onSettled (não onSuccess): sessão local sempre é limpa, mesmo se a
    // chamada ao servidor falhar — usuário nunca fica "preso" logado no client
    onSettled: () => {
      useAuthStore.getState().clear()
      queryClient.clear()
    },
  })
}
