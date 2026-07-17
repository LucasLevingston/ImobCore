import { create } from 'zustand'
import type { AuthUser } from './auth-store.types'

interface AuthState {
  accessToken: string | null
  user: AuthUser | null
  setSession: (accessToken: string | null, user: AuthUser | null) => void
  setAccessToken: (accessToken: string | null) => void
  setUser: (user: AuthUser | null) => void
  clear: () => void
}

// Access token só em memória (nunca localStorage) — DIP: componentes/hooks
// dependem desta abstração, não sabem se o backend é auth-service ou outro
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setSession: (accessToken, user) => set({ accessToken, user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),
  clear: () => set({ accessToken: null, user: null }),
}))
