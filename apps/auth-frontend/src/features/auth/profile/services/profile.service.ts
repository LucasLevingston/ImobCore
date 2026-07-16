import { apiClient } from '../../../../lib/api-client'

export interface ProfileResponse {
  id: string
  name: string
  email: string
  createdAt: string
}

export const profileService = {
  getMe: () => apiClient.get<ProfileResponse>('/api/auth/me'),
}
