import { afterEach, describe, expect, it, vi } from 'vitest'
import { resetToasts } from '../../test-utils'
import { toastStore } from './toast-store'

describe('toastStore.subscribe', () => {
  afterEach(() => {
    resetToasts()
  })

  it('should stop notifying a listener after it unsubscribes', () => {
    const listener = vi.fn()
    const unsubscribe = toastStore.subscribe(listener)

    unsubscribe()
    toastStore.dispatch({ type: 'ADD_TOAST', toast: { id: 'unsub-test', open: true } })

    expect(listener).not.toHaveBeenCalled()
  })

  it('should not remove a different listener when unsubscribe is called more than once', () => {
    const firstListener = vi.fn()
    const secondListener = vi.fn()
    const unsubscribeFirst = toastStore.subscribe(firstListener)
    toastStore.subscribe(secondListener)

    unsubscribeFirst()
    unsubscribeFirst()
    toastStore.dispatch({ type: 'ADD_TOAST', toast: { id: 'double-unsub-test', open: true } })

    expect(firstListener).not.toHaveBeenCalled()
    expect(secondListener).toHaveBeenCalledTimes(1)
  })
})
