import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logoutService } from '../services/logout.service'
import { useAuthStore } from '../stores/auth-store'

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logoutService.logout,
    // onSettled (não onSuccess): sessão local sempre é limpa, mesmo se a
    // chamada ao servidor falhar — usuário nunca fica "preso" logado no
    // client (mesmo racional do useLogout de auth-frontend)
    onSettled: () => {
      useAuthStore.getState().clear()
      queryClient.clear()
    },
  })
}
