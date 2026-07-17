import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { resetToasts } from '../../test-utils'
import { reducer, toast, useToast } from './use-toast'

describe('toast reducer', () => {
  it('should add a toast on ADD_TOAST', () => {
    const state = reducer(
      { toasts: [] },
      { type: 'ADD_TOAST', toast: { id: '1', open: true, title: 'Salvo' } },
    )
    expect(state.toasts).toHaveLength(1)
    expect(state.toasts[0]?.title).toBe('Salvo')
  })

  it('should respect the toast limit when adding', () => {
    const withOne = reducer(
      { toasts: [] },
      { type: 'ADD_TOAST', toast: { id: '1', open: true, title: 'Primeiro' } },
    )
    const withTwo = reducer(withOne, {
      type: 'ADD_TOAST',
      toast: { id: '2', open: true, title: 'Segundo' },
    })
    expect(withTwo.toasts).toHaveLength(1)
    expect(withTwo.toasts[0]?.title).toBe('Segundo')
  })

  it('should mark a toast as closed on DISMISS_TOAST', () => {
    const withOne = reducer(
      { toasts: [] },
      { type: 'ADD_TOAST', toast: { id: '1', open: true, title: 'Salvo' } },
    )
    const dismissed = reducer(withOne, { type: 'DISMISS_TOAST', toastId: '1' })
    expect(dismissed.toasts[0]?.open).toBe(false)
  })

  it('should leave other toasts untouched on DISMISS_TOAST', () => {
    const state: Parameters<typeof reducer>[0] = {
      toasts: [
        { id: '1', open: true, title: 'Um' },
        { id: '2', open: true, title: 'Dois' },
      ],
    }
    const dismissed = reducer(state, { type: 'DISMISS_TOAST', toastId: '1' })
    expect(dismissed.toasts.find((t) => t.id === '1')?.open).toBe(false)
    expect(dismissed.toasts.find((t) => t.id === '2')?.open).toBe(true)
  })

  it('should remove a toast on REMOVE_TOAST', () => {
    const withOne = reducer(
      { toasts: [] },
      { type: 'ADD_TOAST', toast: { id: '1', open: true, title: 'Salvo' } },
    )
    const removed = reducer(withOne, { type: 'REMOVE_TOAST', toastId: '1' })
    expect(removed.toasts).toHaveLength(0)
  })

  it('should merge partial data into the matching toast on UPDATE_TOAST', () => {
    const withOne = reducer(
      { toasts: [] },
      { type: 'ADD_TOAST', toast: { id: '1', open: true, title: 'Enviando...' } },
    )
    const updated = reducer(withOne, {
      type: 'UPDATE_TOAST',
      toast: { id: '1', title: 'Enviado!' },
    })
    expect(updated.toasts[0]?.title).toBe('Enviado!')
    expect(updated.toasts[0]?.open).toBe(true)
  })

  it('should leave other toasts untouched on UPDATE_TOAST', () => {
    const state: Parameters<typeof reducer>[0] = {
      toasts: [
        { id: '1', open: true, title: 'Um' },
        { id: '2', open: true, title: 'Dois' },
      ],
    }
    const updated = reducer(state, {
      type: 'UPDATE_TOAST',
      toast: { id: '1', title: 'Um editado' },
    })
    expect(updated.toasts.find((t) => t.id === '2')?.title).toBe('Dois')
  })
})

describe('useToast / toast()', () => {
  afterEach(() => {
    resetToasts()
  })

  it('should add a toast to the shared state when toast() is called', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      toast({ title: 'Produto criado', description: 'O produto foi salvo com sucesso.' })
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0]?.title).toBe('Produto criado')
  })

  it('should dismiss a toast via the returned dismiss handle', () => {
    const { result } = renderHook(() => useToast())

    let handle: ReturnType<typeof toast>
    act(() => {
      handle = toast({ title: 'Produto criado' })
    })

    act(() => {
      handle.dismiss()
    })

    expect(result.current.toasts[0]?.open).toBe(false)
  })

  it('should update a toast in place via the returned update handle', () => {
    const { result } = renderHook(() => useToast())

    let handle: ReturnType<typeof toast>
    act(() => {
      handle = toast({ title: 'Enviando...' })
    })

    act(() => {
      handle.update({ title: 'Enviado!' })
    })

    expect(result.current.toasts[0]?.title).toBe('Enviado!')
  })

  it('should not schedule a second removal timeout if dismiss is called twice for the same toast', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useToast())

    let handle: ReturnType<typeof toast>
    act(() => {
      handle = toast({ title: 'Produto criado' })
    })
    act(() => {
      handle.dismiss()
      handle.dismiss()
    })

    act(() => {
      vi.runAllTimers()
    })

    expect(result.current.toasts).toHaveLength(0)
    vi.useRealTimers()
  })

  it('should remove the toast from state after the removal delay elapses', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useToast())

    act(() => {
      toast({ title: 'Produto criado' })
    })
    act(() => {
      result.current.dismiss(result.current.toasts[0]!.id)
    })

    act(() => {
      vi.runAllTimers()
    })

    expect(result.current.toasts).toHaveLength(0)
    vi.useRealTimers()
  })
})
