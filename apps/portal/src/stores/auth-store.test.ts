import { afterEach, describe, expect, it } from 'vitest'
import { useAuthStore } from './auth-store'

const user = {
  id: 'user-1',
  name: 'Lucas',
  email: 'lucas@email.com',
  createdAt: '2026-01-01T00:00:00.000Z',
}

describe('useAuthStore', () => {
  afterEach(() => {
    useAuthStore.getState().clear()
  })

  it('should start with no access token and no user', () => {
    const state = useAuthStore.getState()
    expect(state.accessToken).toBeNull()
    expect(state.user).toBeNull()
  })

  it('should set access token and user together via setSession', () => {
    useAuthStore.getState().setSession('token-123', user)

    const state = useAuthStore.getState()
    expect(state.accessToken).toBe('token-123')
    expect(state.user).toEqual(user)
  })

  it('should update only the access token via setAccessToken, keeping user intact', () => {
    useAuthStore.getState().setSession('token-123', user)
    useAuthStore.getState().setAccessToken('token-456')

    const state = useAuthStore.getState()
    expect(state.accessToken).toBe('token-456')
    expect(state.user).toEqual(user)
  })

  it('should update only the user via setUser, keeping access token intact', () => {
    useAuthStore.getState().setSession('token-123', null)
    useAuthStore.getState().setUser(user)

    const state = useAuthStore.getState()
    expect(state.accessToken).toBe('token-123')
    expect(state.user).toEqual(user)
  })

  it('should reset both access token and user on clear', () => {
    useAuthStore.getState().setSession('token-123', user)
    useAuthStore.getState().clear()

    const state = useAuthStore.getState()
    expect(state.accessToken).toBeNull()
    expect(state.user).toBeNull()
  })
})
