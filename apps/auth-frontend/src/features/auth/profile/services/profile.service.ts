import { apiClient } from '../../../../lib/api-client'
import type { ProfileResponse } from './profile.service.types'

export const profileService = {
  getMe: () => apiClient.get<ProfileResponse>('/api/auth/me'),
}
