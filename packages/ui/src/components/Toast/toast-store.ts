import { reducer } from './reducer'
import type { ToastAction, ToastState } from './toast.types'

const TOAST_REMOVE_DELAY = 1_000_000

let memoryState: ToastState = { toasts: [] }
const listeners: Array<(state: ToastState) => void> = []
const removeTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

function dispatch(action: ToastAction) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

function scheduleRemoval(toastId: string) {
  if (removeTimeouts.has(toastId)) return
  const timeout = setTimeout(() => {
    removeTimeouts.delete(toastId)
    dispatch({ type: 'REMOVE_TOAST', toastId })
  }, TOAST_REMOVE_DELAY)
  removeTimeouts.set(toastId, timeout)
}

// API único exportado — encapsula o estado do módulo (memoryState/listeners,
// que vive fora da árvore React) sem cada peça virar um export próprio (isso
// exigiria vários exports soltos no mesmo arquivo, um por função auxiliar).
export const toastStore = {
  getState: () => memoryState,
  subscribe: (listener: (state: ToastState) => void) => {
    listeners.push(listener)
    return () => {
      const index = listeners.indexOf(listener)
      if (index > -1) listeners.splice(index, 1)
    }
  },
  dispatch,
  scheduleRemoval,
}
