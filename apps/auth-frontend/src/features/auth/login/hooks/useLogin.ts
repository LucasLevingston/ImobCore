import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '../../../../stores/auth-store'
import { loginService } from '../services/login.service'

export function useLogin() {
  return useMutation({
    mutationFn: loginService.login,
    onSuccess: (data) => {
      useAuthStore.getState().setAccessToken(data.accessToken)
    },
  })
}
