import { describe, expect, it } from 'vitest'
import { makeUser } from '../../../test-utils/factories/make-user'
import { toUserResponse } from './user-response.mapper'

describe('toUserResponse', () => {
  it('should map id, name, email and createdAt as ISO string', () => {
    const user = makeUser({ id: 'user-1', name: 'Lucas', email: 'lucas@email.com' })

    const response = toUserResponse(user)

    expect(response).toEqual({
      id: 'user-1',
      name: 'Lucas',
      email: 'lucas@email.com',
      createdAt: user.createdAt.toISOString(),
    })
  })

  it('should never include passwordHash', () => {
    const user = makeUser({ passwordHash: 'super-secret-hash' })

    const response = toUserResponse(user)

    expect(response).not.toHaveProperty('passwordHash')
  })
})
