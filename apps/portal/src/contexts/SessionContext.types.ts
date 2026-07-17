import type { SessionUser } from '../services/session.service.types'

export interface SessionContextValue {
  user: SessionUser | null
  isAuthenticated: boolean
  isLoading: boolean
}
