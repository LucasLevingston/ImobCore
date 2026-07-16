import { apiClient } from '../../../../lib/api-client'
import type { RegisterFormValues } from '../schemas/register.schema'

export interface RegisterResponse {
  id: string
  name: string
  email: string
  createdAt: string
}

export const registerService = {
  // skipAuth: rota pública, nunca deve disparar o refresh automático do apiClient
  register: (data: RegisterFormValues) =>
    apiClient.post<RegisterResponse>('/api/auth/register', data, { skipAuth: true }),
}
