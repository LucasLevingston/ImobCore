import { afterEach, describe, expect, it, vi } from 'vitest'
import { reloadAfterLogout } from './reload-after-logout'

describe('reloadAfterLogout', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should reload the current page', () => {
    const reloadSpy = vi.fn()
    vi.stubGlobal('location', { ...window.location, reload: reloadSpy })

    reloadAfterLogout()

    expect(reloadSpy).toHaveBeenCalledTimes(1)
  })
})
