import { apiClient } from '../lib/api-client'
import type { SessionUser } from './session.service.types'

export const sessionService = {
  getMe: () => apiClient.get<SessionUser>('/api/auth/me'),
}
