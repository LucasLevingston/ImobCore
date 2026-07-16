import { apiClient } from '../../../../lib/api-client'
import type { LoginFormValues } from '../schemas/login.schema'

export interface LoginResponse {
  accessToken: string
}

export const loginService = {
  // skipAuth: 401 aqui é credencial errada, não sessão expirada — nunca deve
  // disparar o refresh automático do apiClient (seria sem sentido: refresh
  // não corrige uma senha incorreta)
  login: (data: LoginFormValues) =>
    apiClient.post<LoginResponse>('/api/auth/login', data, { skipAuth: true }),
}
