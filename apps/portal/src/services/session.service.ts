import { apiClient } from '../lib/api-client'

export interface SessionUser {
  id: string
  name: string
  email: string
  createdAt: string
}

export const sessionService = {
  getMe: () => apiClient.get<SessionUser>('/api/auth/me'),
}
