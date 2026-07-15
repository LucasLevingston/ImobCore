import { apiClient } from '../lib/api-client'

export const logoutService = {
  logout: () => apiClient.post<void>('/api/auth/logout'),
}
